from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import sys
import threading
import time
import queue
import io
import contextlib
from datetime import datetime
from typing import Iterator
import logging

# Load environment variables
load_dotenv()

# Configure logging to file and console
LOG_FILE = "app.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("api")

# Log startup
logger.info("=" * 60)
logger.info("LinkedIn Post AI API starting up")
logger.info(f"Log file: {os.path.abspath(LOG_FILE)}")
logger.info("=" * 60)

app = FastAPI(title="LinkedIn Post AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SSE event queue (simple single-user implementation; extend with per-session queues for multi-user)
sse_queue: queue.Queue = queue.Queue()

# Agent order mapping for progress tracking
AGENT_ORDER = [
    "Research Specialist",
    "Content Strategist",
    "Content Writer",
    "Content Editor",
    "Content Optimizer",
    "Posting Scheduler"
]

AGENT_ICONS = {
    "Research Specialist": "🔍",
    "Content Strategist": "📋",
    "Content Writer": "✍️",
    "Content Editor": "📝",
    "Content Optimizer": "🚀",
    "Posting Scheduler": "📅"
}

class GenerateRequest(BaseModel):
    topic: str
    tone: str = "Professional and engaging"
    target_audience: str = "Tech leaders and founders"
    num_variations: int = 1
    include_emojis: bool = True

def capture_agent_events():
    """Capture CrewAI verbose output and emit SSE events for agent progress."""
    buffer = io.StringIO()
    original_stdout = sys.stdout

    class TeeIO(io.TextIOBase):
        def __init__(self, original, buffer):
            self.original = original
            self.buffer = buffer
            self.line_buffer = ""

        def write(self, s):
            self.original.write(s)
            self.buffer.write(s)
            # Check for agent start/complete
            self.line_buffer += s
            if "\n" in self.line_buffer:
                lines = self.line_buffer.split("\n")
                for line in lines[:-1]:
                    self.check_line(line.strip())
                self.line_buffer = lines[-1]

        def check_line(self, line):
            # Detect agent starting a task
            for agent_name in AGENT_ORDER:
                if f"Working Agent: {agent_name}" in line or f"Agent: {agent_name}" in line:
                    sse_queue.put({
                        "agent": agent_name,
                        "status": "running",
                        "step": AGENT_ORDER.index(agent_name) + 1,
                        "icon": AGENT_ICONS[agent_name]
                    })
                # Detect task completion for agent
                if f"Task completed" in line or "Done." in line or "finished" in line.lower():
                    # We need to map completion to the last running agent
                    pass

        def flush(self):
            self.original.flush()
            self.buffer.flush()

    return TeeIO(original_stdout, buffer), buffer

def run_generation_thread(topic: str, tone: str, target_audience: str, num_variations: int, include_emojis: bool):
    """Background thread to run the LinkedIn post generation pipeline."""
    start_time = time.time()
    logger.info(f"Generation thread started - Topic: '{topic}', Tone: '{tone}', Audience: '{target_audience}', Variations: {num_variations}")
    try:
        # Emit start event
        sse_queue.put({"type": "start", "message": "Generation started"})

        # Import main here to avoid circular imports
        from main import run_linkedin_post_generator

        # Redirect stdout to capture CrewAI verbose output
        tee, buf = capture_agent_events()
        with contextlib.redirect_stdout(tee):
            result = run_linkedin_post_generator(
                topic=topic,
                tone=tone if tone else None,
                target_audience=target_audience if target_audience else None,
                num_variations=num_variations,
                include_emojis=include_emojis
            )

        duration = round(time.time() - start_time, 2)
        logger.info(f"Generation completed in {duration}s - Output file: {filename}")

        # Find the latest output file
        output_dir = "outputs"
        files = os.listdir(output_dir)
        if files:
            latest_file = max([os.path.join(output_dir, f) for f in files], key=os.path.getmtime)
            filename = os.path.basename(latest_file)
        else:
            filename = None

        # Emit completion event
        sse_queue.put({
            "type": "complete",
            "success": True,
            "result": str(result),
            "output_file": filename,
            "duration_seconds": duration
        })

    except Exception as e:
        duration = round(time.time() - start_time, 2)
        logger.error(f"Generation failed after {duration}s: {str(e)}", exc_info=True)
        sse_queue.put({
            "type": "error",
            "success": False,
            "error": str(e),
            "duration_seconds": duration
        })
    finally:
        # Signal end of stream
        sse_queue.put(None)

@app.post("/generate")
async def generate_post(request: GenerateRequest):
    """Start LinkedIn post generation in a background thread."""
    logger.info(f"POST /generate - Topic: '{request.topic}', Tone: '{request.tone}', Variations: {request.num_variations}")
    if not request.topic.strip():
        logger.warning("Generation request rejected - missing topic")
        raise HTTPException(status_code=422, detail="Topic is required")

    # Check if OPENAI_API_KEY is set
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        logger.error("OPENAI_API_KEY not configured")
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")

    # Start background thread
    thread = threading.Thread(
        target=run_generation_thread,
        args=(request.topic, request.tone, request.target_audience, request.num_variations, request.include_emojis),
        daemon=True
    )
    thread.start()
    logger.info("Background generation thread started")

    return JSONResponse(status_code=202, content={"success": True, "message": "Generation started"})

@app.get("/generate/stream")
async def generate_stream():
    """Server-Sent Events endpoint for live generation progress."""
    def event_generator() -> Iterator[str]:
        while True:
            try:
                event = sse_queue.get(timeout=30)  # 30s timeout
                if event is None:
                    yield "data: {\"type\": \"end\"}\n\n"
                    break
                # Format as SSE
                import json
                yield f"data: {json.dumps(event)}\n\n"
            except queue.Empty:
                yield "data: {\"type\": \"keepalive\"}\n\n"
                continue

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/outputs")
async def list_outputs():
    """List all saved output files with preview."""
    logger.info("GET /outputs")
    output_dir = "outputs"
    if not os.path.exists(output_dir):
        logger.info("Outputs directory does not exist")
        return []

    outputs = []
    for filename in sorted(os.listdir(output_dir), reverse=True):
        if not filename.endswith(".txt"):
            continue
        filepath = os.path.join(output_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                lines = [line.strip() for line in f.readlines() if line.strip()]
                preview = " ".join(lines[:3])[:200] + "..." if len(lines) >= 3 else " ".join(lines)
                # Extract topic from first line
                topic = lines[0].replace("Topic: ", "") if lines and lines[0].startswith("Topic:") else filename
                # Extract generated time
                generated_at = None
                for line in lines:
                    if line.startswith("Generated:"):
                        generated_at = line.replace("Generated:", "").strip()
                        break
        except Exception:
            preview = "Unable to read file"
            topic = filename
            generated_at = None

        outputs.append({
            "filename": filename,
            "topic": topic,
            "generated_at": generated_at,
            "preview": preview
        })

    return outputs

@app.get("/outputs/{filename}")
async def get_output(filename: str):
    """Return full content of a saved output file."""
    output_dir = "outputs"
    filepath = os.path.join(output_dir, filename)
    if not os.path.exists(filepath) or not filename.endswith(".txt"):
        raise HTTPException(status_code=404, detail="File not found")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    return {"filename": filename, "content": content}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    api_key = os.getenv("OPENAI_API_KEY")
    configured = bool(api_key and api_key != "your_openai_api_key_here")
    logger.info(f"GET /health - openai_configured: {configured}")
    return {
        "status": "ok",
        "openai_configured": configured
    }

# Serve static files
@app.get("/")
async def root():
    return FileResponse("static/index.html")

# Mount static directory
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

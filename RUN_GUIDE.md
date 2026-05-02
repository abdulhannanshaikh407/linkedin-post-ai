# LinkedIn Post AI — How to Run

Complete setup and usage guide for the LinkedIn Post AI web application.

## Prerequisites

- **Python 3.10, 3.11, 3.12, or 3.13** (Python 3.14 is not yet supported by crewai)
- **OpenAI API Key** — get one at https://platform.openai.com/api-keys
- **Git** (for cloning the repository)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/crew-ai.git
cd crew-ai
```

---

## Step 2: Set Up Environment Variables

The application requires an OpenAI API key to generate posts.

### 2a. Create the `.env` file

Copy the example environment file:

```bash
# Windows (PowerShell)
copy .env.example .env

# Windows (CMD)
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

### 2b. Add your OpenAI API Key

Open the newly created `.env` file and replace the placeholder with your actual API key:

```env
# .env file
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Change the model (default is gpt-3.5-turbo)
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_MODEL=gpt-4o
```

**Important:** Never commit your `.env` file to version control. The `.gitignore` should already exclude it.

### Where to put the `.env` file

```
crew-ai/
├── .env          ← Put it here (in the project root)
├── .env.example
├── api.py
├── main.py
├── ...
```

---

## Step 3: Install Dependencies

### Option A: Using pip (recommended)

```bash
pip install -r requirements.txt
```

This will install:
- `crewai` — Multi-agent orchestration
- `fastapi` — Web API framework
- `uvicorn` — ASGI server
- `python-dotenv` — Environment variable loader
- `httpx`, `pytest`, `pytest-asyncio` — Testing tools

### Option B: Using a virtual environment (best practice)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Troubleshooting Installation

**Problem:** `pip install` fails with `tiktoken` build error (Rust compiler not found)

**Solution:** Ensure you're using Python 3.10-3.13. Python 3.14 is not yet supported by crewai.

```bash
# Check your Python version
python --version
```

**Problem:** `ERROR: Cannot install ... conflicting dependencies`

**Solution:** Clean install in a fresh virtual environment:
```bash
python -m venv venv_clean
# Activate as shown above
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Step 4: Run the Application

### Start the web server

```bash
python run.py
```

You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [67890]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Open the web interface

Open your browser and navigate to:

```
http://localhost:8000
```

---

## Step 5: Generate Your First Post

1. **Enter a topic** — e.g., "The future of remote work"
2. **Set the tone** — e.g., "Professional and engaging" (optional)
3. **Define target audience** — e.g., "Tech leaders and founders" (optional)
4. **Choose variations** — Slide between 1-5
5. **Toggle emojis** — Enable/disable emoji usage
6. **Click "Generate Post"** — Watch the 6 agents work in real-time!

### What happens during generation

The 6 AI agents work sequentially:

| Step | Agent | What it does |
|------|-------|---------------|
| 1 | Research Specialist | Gathers trending topics and industry insights |
| 2 | Content Strategist | Creates content strategy and outline |
| 3 | Content Writer | Writes the draft post |
| 4 | Content Editor | Refines grammar, clarity, and flow |
| 5 | Content Optimizer | Adds hashtags, keywords, and engagement hooks |
| 6 | Posting Scheduler | Determines optimal posting time |

Total time: Typically 30-90 seconds depending on model and topic complexity.

---

## Step 6: View Logs

The application logs all activity to `app.log` in the project root directory.

### What gets logged

- API requests (endpoints accessed)
- Generation start/completion with timing
- Errors and exceptions with full tracebacks
- Startup and shutdown events

### View live logs

```bash
# Windows (PowerShell)
Get-Content app.log -Tail 50 -Wait

# Windows (CMD)
type app.log | more

# macOS/Linux
tail -f app.log
```

### Log file location

```
crew-ai/
├── app.log       ← All application logs are saved here
├── outputs/
│   └── ...      ← Generated posts saved here
├── ...
```

---

## Step 7: Using the CLI (Alternative to Web UI)

You can also generate posts directly from the command line:

```bash
python main.py --topic "Future of AI" --tone "Inspirational" --variations 2
```

### CLI Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--topic` | Yes | - | Topic for the LinkedIn post |
| `--tone` | No | None | Tone of the post (e.g., professional, casual) |
| `--audience` | No | None | Target audience for the post |
| `--variations` | No | 1 | Number of post variations to generate |
| `--no-emojis` | No | False | Disable emojis in the post |

---

## Step 8: Running Tests

To verify everything is working correctly:

```bash
pytest tests/ -v
```

Expected output:
```
tests/test_api.py::test_health PASSED
tests/test_api.py::test_root_serves_html PASSED
tests/test_api.py::test_outputs_empty_or_list PASSED
tests/test_api.py::test_generate_missing_topic PASSED
tests/test_api.py::test_generate_empty_topic PASSED
tests/test_api.py::test_generate_valid_request PASSED
tests/test_api.py::test_nonexistent_output PASSED
tests/test_api.py::test_static_files PASSED

============================== 8 passed in 0.22s ==============================
```

---

## Docker Usage (Optional)

If you prefer using Docker:

```bash
# Build and run with docker-compose
docker-compose up

# Or build and run manually
docker build -t linkedin-post-ai .
docker run -p 8000:8000 --env-file .env linkedin-post-ai
```

---

## Common Issues & Solutions

### Issue: "OPENAI_API_KEY is not configured"

**Cause:** The `.env` file is missing or the API key isn't set.

**Fix:**
1. Ensure `.env` exists in the project root
2. Verify it contains `OPENAI_API_KEY=sk-your-key-here`
3. Restart the server after creating/updating `.env`

### Issue: "Failed to build wheel for tiktoken"

**Cause:** Python 3.14 is not supported by crewai yet.

**Fix:** Use Python 3.10, 3.11, 3.12, or 3.13.

```bash
# Check available Python versions
py --list

# Run with a specific version (e.g., 3.12)
py -3.12 run.py
```

### Issue: Port 8000 already in use

**Cause:** Another process is using port 8000.

**Fix:** Either stop the other process, or change the port in `run.py`:
```python
uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)
```

### Issue: Generation fails with OpenAI API error

**Cause:** Invalid API key, insufficient credits, or rate limiting.

**Fix:**
1. Verify your API key at https://platform.openai.com/api-keys
2. Check your account balance at https://platform.openai.com/usage
3. Try a different model in `.env`: `OPENAI_MODEL=gpt-3.5-turbo`

---

## Project Structure Reference

```
crew-ai/
├── .env                    ← Your API keys (create from .env.example)
├── .env.example            ← Template for environment variables
├── .gitignore
├── api.py                  ← FastAPI backend with SSE streaming
├── main.py                 ← CLI entry point + crew orchestration
├── agents.py               ← 6 specialized CrewAI agents
├── tasks.py                ← Task definitions for each agent
├── run.py                  ← Server startup script
├── requirements.txt        ← Python dependencies
├── RUN_GUIDE.md           ← This file
├── README.md              ← Project documentation
├── app.log                 ← Application logs (created on startup)
├── static/
│   └── index.html         ← Single-file premium UI
├── outputs/                ← Generated LinkedIn posts (created on first run)
│   └── Topic_20250501_123456.txt
├── tests/
│   └── test_api.py        ← API test suite
├── Dockerfile
└── docker-compose.yml
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start server | `python run.py` |
| View in browser | http://localhost:8000 |
| View logs | `type app.log` (Windows) / `tail -f app.log` (Mac/Linux) |
| Run tests | `pytest tests/ -v` |
| CLI generation | `python main.py --topic "Your topic"` |
| Health check | `curl http://localhost:8000/health` |

---

## Need Help?

- **OpenAI API issues:** https://platform.openai.com/docs
- **CrewAI documentation:** https://docs.crewai.com/
- **FastAPI documentation:** https://fastapi.tiangolo.com/

For bugs or feature requests, open an issue on the GitHub repository.

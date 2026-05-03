# 🤖 LinkedIn Post AI — CrewAI Multi-Agent Pipeline

> Generate optimized LinkedIn posts using 6 specialized AI agents working in sequence. A production-grade demo of multi-agent orchestration with a premium web UI.

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://www.python.org/)
[![CrewAI](https://img.shields.io/badge/CrewAI-0.28+-purple?logo=python)](https://github.com/joaomdmoura/crewAI)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-blue?logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Demo

<img width="540" height="1600" alt="Success State" src="https://github.com/user-attachments/assets/83d6ca9c-8e3b-4ffd-a9cb-e50397193dff" />
<img width="599" height="1600" alt="Strate" src="https://github.com/user-attachments/assets/4795fcdb-480f-460a-bcb2-cbed4024b2c1" />
<img width="580" height="1600" alt="Settings" src="https://github.com/user-attachments/assets/72f32b56-9c16-4f8e-9d53-2c95bb33d94b" />
<img width="575" height="1600" alt="Scheduling" src="https://github.com/user-attachments/assets/5259d7e8-3b27-4b38-87e4-045aa04d5cc8" />
<img width="561" height="1600" alt="Rearch" src="https://github.com/user-attachments/assets/1639d35a-f044-4698-81d6-f92d60c2eebd" />
<img width="557" height="1600" alt="Optmizer" src="https://github.com/user-attachments/assets/0bbefba0-bd73-42a2-bdad-949e5f052884" />
<img width="527" height="1600" alt="Dashboard" src="https://github.com/user-attachments/assets/f73035c4-64b6-4a69-b0b7-cf660ca74a25" />
<img width="1600" height="1399" alt="screen" src="https://github.com/user-attachments/assets/917a0ec0-5210-477d-8299-0f45609da589" />
<img width="397" height="1600" alt="All agents" src="https://github.com/user-attachments/assets/5f34defd-cdb7-4d65-ac55-79943db33da0" />
<img width="514" height="1600" alt="Write" src="https://github.com/user-attachments/assets/949ec1d2-86ce-4b18-91ee-3b69674b9de5" />



## 🏗️ Architecture

```
Research → Strategy → Writing → Editing → Optimization → Scheduling
   ↓           ↓          ↓         ↓            ↓              ↓
Research    Content    Content   Content      Content        Posting
Specialist Strategist  Writer    Editor      Optimizer      Scheduler
```

Each agent is a specialized LLM-powered worker that handles one stage of the content pipeline:

| Agent | Role | Output |
|-------|------|--------|
| 🔍 Research Specialist | Gathers trending topics and industry insights | Research brief |
| 📋 Content Strategist | Defines tone, outlines (hook, body, CTA) | Content strategy |
| ✍️ Content Writer | Writes engaging posts with strong hooks | Draft post |
| 📝 Content Editor | Refines grammar, clarity, and flow | Polished post |
| 🚀 Content Optimizer | Adds hashtags, keywords, and engagement hooks | Optimized post |
| 📅 Posting Scheduler | Determines optimal posting times | Final post + schedule |

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- OpenAI API key

### Steps
```bash
# Clone the repository
git clone https://github.com/abdulhannanshaikh407/linkedin-post-ai.git
cd linkedin-post-ai

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start the web UI (recommended)
python run.py
# Open http://localhost:8000 in your browser

# Or run via CLI
python main.py --topic "Future of AI" --tone "Inspirational" --variations 2
```

## 🛠️ Tech Stack
- **CrewAI** — Multi-agent orchestration framework
- **OpenAI GPT** — Language model backbone
- **FastAPI** — High-performance REST API + SSE streaming
- **Vanilla JS** — Zero-dependency frontend with glass-morphism design
- **Uvicorn** — ASGI server

## 📁 Project Structure
```
crew-ai/
├── api.py              # FastAPI backend with SSE streaming
├── main.py             # CLI entry point + crew orchestration
├── agents.py           # 6 specialized CrewAI agents
├── tasks.py            # Task definitions for each agent
├── run.py              # Server startup script
├── requirements.txt    # Python dependencies
├── static/
│   └── index.html     # Single-file premium UI
├── outputs/           # Generated LinkedIn posts
├── tests/
│   └── test_api.py    # API test suite
├── .env.example       # Environment variable template
└── README.md          # This file
```

## 🧪 Tests
```bash
# Run API tests
pytest tests/ -v

# Test the health endpoint
curl http://localhost:8000/health

# Test generation (requires OpenAI API key)
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Future of remote work", "tone": "Professional", "target_audience": "Tech leaders"}'
```

## 📄 License
MIT License — feel free to use this project for learning or portfolio purposes.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## 📬 Contact
For questions or feedback, open an issue on GitHub.

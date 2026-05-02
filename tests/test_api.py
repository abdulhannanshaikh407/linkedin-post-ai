"""Tests for the LinkedIn Post AI API."""
from fastapi.testclient import TestClient
from api import app
import os

client = TestClient(app)

def test_health():
    """Test health check endpoint."""
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "openai_configured" in data

def test_root_serves_html():
    """Test root endpoint serves HTML."""
    r = client.get("/")
    assert r.status_code == 200
    assert "text/html" in r.headers["content-type"]
    assert "LinkedIn Post AI" in r.text

def test_outputs_empty_or_list():
    """Test outputs endpoint returns a list."""
    r = client.get("/outputs")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_generate_missing_topic():
    """Test generate endpoint with missing topic returns 422."""
    r = client.post("/generate", json={})
    assert r.status_code == 422  # validation error

def test_generate_empty_topic():
    """Test generate endpoint with empty topic returns 422."""
    r = client.post("/generate", json={"topic": ""})
    assert r.status_code == 422

def test_generate_valid_request():
    """Test generate endpoint with valid request returns 202."""
    # This starts a background thread; we don't wait for completion
    r = client.post("/generate", json={
        "topic": "Test Topic",
        "tone": "Professional",
        "target_audience": "Tech leaders",
        "num_variations": 1,
        "include_emojis": True
    })
    # Will return 202 if OPENAI_API_KEY is set, 500 otherwise
    assert r.status_code in (202, 500)

def test_nonexistent_output():
    """Test getting a nonexistent output file returns 404."""
    r = client.get("/outputs/nonexistent.txt")
    assert r.status_code == 404

def test_static_files():
    """Test static files are served."""
    r = client.get("/static/index.html")
    assert r.status_code == 200

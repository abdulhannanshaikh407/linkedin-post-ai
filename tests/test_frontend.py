"""
Tests for the LinkedIn AI frontend and API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import app

client = TestClient(app)


class TestRootEndpoint:
    """Test that the root endpoint serves the index.html file."""

    def test_root_returns_200(self):
        """GET / returns 200 status code."""
        response = client.get("/")
        assert response.status_code == 200

    def test_root_returns_html_content_type(self):
        """GET / returns content-type text/html."""
        response = client.get("/")
        assert "text/html" in response.headers["content-type"]

    def test_root_returns_html_content(self):
        """GET / returns HTML content with expected title."""
        response = client.get("/")
        assert "LinkedIn AI" in response.text


class TestHealthEndpoint:
    """Test the health check endpoint."""

    def test_health_returns_200(self):
        """GET /health returns 200."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_returns_json(self):
        """GET /health returns JSON."""
        response = client.get("/health")
        assert response.headers["content-type"] == "application/json"

    def test_health_has_status_key(self):
        """GET /health returns JSON with 'status' key."""
        response = client.get("/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"

    def test_health_has_openai_configured_key(self):
        """GET /health returns JSON with 'openai_configured' key."""
        response = client.get("/health")
        data = response.json()
        assert "openai_configured" in data
        assert isinstance(data["openai_configured"], bool)


class TestOutputsEndpoint:
    """Test the outputs listing endpoint."""

    def test_outputs_returns_200(self):
        """GET /outputs returns 200."""
        response = client.get("/outputs")
        assert response.status_code == 200

    def test_outputs_returns_json(self):
        """GET /outputs returns JSON."""
        response = client.get("/outputs")
        assert response.headers["content-type"] == "application/json"

    def test_outputs_returns_list(self):
        """GET /outputs returns a list."""
        response = client.get("/outputs")
        data = response.json()
        assert isinstance(data, list)


class TestStaticFiles:
    """Test that static files are served correctly."""

    def test_static_index_html_exists(self):
        """static/index.html file exists."""
        static_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "static",
            "index.html"
        )
        assert os.path.exists(static_path), "static/index.html does not exist"

    def test_static_file_served(self):
        """GET /static/index.html returns 200."""
        response = client.get("/static/index.html")
        assert response.status_code == 200


class TestGeneratorPageElements:
    """Test that the generator page has required elements."""

    def test_has_generator_tab(self):
        """Page contains generator tab."""
        response = client.get("/")
        assert "page-generator" in response.text

    def test_has_history_tab(self):
        """Page contains history tab."""
        response = client.get("/")
        assert "page-history" in response.text

    def test_has_settings_tab(self):
        """Page contains settings tab."""
        response = client.get("/")
        assert "page-settings" in response.text

    def test_has_theme_toggle(self):
        """Page contains theme toggle button."""
        response = client.get("/")
        assert "theme-toggle" in response.text

    def test_has_toast_container(self):
        """Page contains toast container."""
        response = client.get("/")
        assert "toast-container" in response.text

    def test_has_modal(self):
        """Page contains modal for viewing posts."""
        response = client.get("/")
        assert "modal" in response.text


class TestResponsiveDesign:
    """Test that responsive design elements are present."""

    def test_has_sidebar(self):
        """Page contains desktop sidebar."""
        response = client.get("/")
        assert "sidebar" in response.text

    def test_has_bottom_nav(self):
        """Page contains mobile bottom nav."""
        response = client.get("/")
        assert "bottom-nav" in response.text

    def test_has_viewport_meta(self):
        """Page has viewport meta tag for mobile."""
        response = client.get("/")
        assert "viewport" in response.text


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

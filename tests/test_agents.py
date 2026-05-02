import pytest
from unittest.mock import patch, MagicMock, sys

# Create a mock Task class that stores constructor arguments as attributes
class MockTask:
    def __init__(self, description, agent, expected_output=None):
        self.description = description
        self.agent = agent
        self.expected_output = expected_output

# Mock crewai module
mock_crewai = MagicMock()
mock_crewai.Task = MockTask
mock_crewai.Agent = MagicMock()
sys.modules['crewai'] = mock_crewai

# Mock langchain_openai
sys.modules['langchain_openai'] = MagicMock()

def test_task_accepts_agent_parameter():
    """Tasks should accept agent as parameter, not create their own"""
    from tasks import create_research_task
    mock_agent = MagicMock()
    task = create_research_task(mock_agent, "Test topic")
    assert task.agent == mock_agent

def test_run_pipeline_with_mocked_crew():
    """Full pipeline should run with mocked crew"""
    # Mock the agents' _get_llm to avoid API key check
    with patch('agents._get_llm', return_value=MagicMock()):
        with patch('main.Crew') as MockCrew:
            mock_instance = MagicMock()
            mock_instance.kickoff.return_value = "Mock LinkedIn post output"
            MockCrew.return_value = mock_instance

            from main import run_linkedin_post_generator
            result = run_linkedin_post_generator(topic="Test topic")

            assert MockCrew.called
            assert mock_instance.kickoff.called
            assert result == "Mock LinkedIn post output"

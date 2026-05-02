from unittest.mock import MagicMock, patch, sys

# Create a mock Task class that stores constructor arguments as attributes
class MockTask:
    def __init__(self, description, agent, expected_output=None):
        self.description = description
        self.agent = agent
        self.expected_output = expected_output

# Mock crewai module before importing tasks
mock_crewai = MagicMock()
mock_crewai.Task = MockTask
sys.modules['crewai'] = mock_crewai

from tasks import (
    create_research_task,
    create_strategy_task,
    create_writing_task,
    create_editing_task,
    create_optimization_task,
    create_scheduling_task
)

def test_research_task_includes_target_audience():
    mock_agent = MagicMock()
    task = create_research_task(mock_agent, "AI", target_audience="developers")
    assert "developers" in task.description

def test_optimization_task_no_emojis():
    mock_agent = MagicMock()
    task = create_optimization_task(mock_agent, num_variations=1, include_emojis=False)
    assert "Do not include emojis" in task.description

def test_optimization_task_variations():
    mock_agent = MagicMock()
    task = create_optimization_task(mock_agent, num_variations=3)
    assert "3 variations" in task.description

def test_strategy_task_includes_tone():
    mock_agent = MagicMock()
    task = create_strategy_task(mock_agent, "AI", tone="professional")
    assert "professional" in task.description

def test_editing_task_returns_task():
    mock_agent = MagicMock()
    task = create_editing_task(mock_agent)
    assert task.agent == mock_agent

def test_scheduling_task_returns_task():
    mock_agent = MagicMock()
    task = create_scheduling_task(mock_agent)
    assert task.agent == mock_agent

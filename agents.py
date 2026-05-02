from crewai import Agent
from langchain_openai import ChatOpenAI
import os

# LLM cache to avoid recreating instances
_llm_cache = None

def _get_llm():
    global _llm_cache
    if _llm_cache is not None:
        return _llm_cache

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        raise ValueError(
            "OPENAI_API_KEY is not set or is invalid. "
            "Copy .env.example to .env and add your key."
        )

    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    _llm_cache = ChatOpenAI(
        model=model,
        temperature=0.7,
        openai_api_key=api_key
    )
    return _llm_cache

def create_research_agent():
    llm = _get_llm()
    return Agent(
        role='Research Specialist',
        goal='Gather trending topics, industry insights, and content ideas for LinkedIn posts',
        backstory="""You are an expert researcher with deep knowledge of LinkedIn trends,
        industry news, and content performance analytics. You excel at finding relevant
        topics that resonate with professional audiences.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_content_strategist_agent():
    llm = _get_llm()
    return Agent(
        role='Content Strategist',
        goal='Define tone, create structured outlines (hook, body, CTA) for LinkedIn content',
        backstory="""You are a strategic content planner who understands LinkedIn's algorithm
        and audience psychology. You craft compelling content frameworks that drive engagement
        while maintaining brand voice.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_writer_agent():
    llm = _get_llm()
    return Agent(
        role='Content Writer',
        goal='Write engaging, high-quality LinkedIn posts with strong hooks and storytelling',
        backstory="""You are a skilled LinkedIn content writer known for creating viral
        professional posts. You excel at hook-driven storytelling that converts readers
        into engagers.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_editor_agent():
    llm = _get_llm()
    return Agent(
        role='Content Editor',
        goal='Refine grammar, clarity, flow, and professionalism of LinkedIn content',
        backstory="""You are a meticulous editor with expertise in professional writing
        and LinkedIn best practices. You polish content to perfection while preserving
        the original voice and intent.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_content_optimizer_agent():
    llm = _get_llm()
    return Agent(
        role='Content Optimizer',
        goal='Optimize LinkedIn posts for algorithm performance with hashtags, keywords, and engagement hooks',
        backstory="""You are a LinkedIn algorithm expert who understands what makes
        content perform well. You strategically add hashtags, optimize keywords, format
        for readability, and insert engagement triggers without being spammy.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_scheduling_agent():
    llm = _get_llm()
    return Agent(
        role='Posting Scheduler',
        goal='Determine optimal posting times and prepare content for LinkedIn scheduling',
        backstory="""You are a social media timing expert who analyzes audience behavior
        patterns to determine the best times for maximum LinkedIn engagement. You prepare
        content for seamless scheduling integration.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

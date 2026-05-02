from crewai import Task

def create_research_task(agent, topic, target_audience=None):
    description = f"""
    Research trending topics, industry insights, and content ideas related to: {topic}
    """
    if target_audience:
        description += f"\nTarget audience: {target_audience}"

    description += """

    Provide:
    1. Key trends and current discussions in the industry
    2. Relevant statistics or data points (can be simulated)
    3. Content angles that would resonate with the target audience
    4. Recent news or developments worth mentioning

    Format your response as a structured research brief.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output="A comprehensive research brief with trending topics, insights, and content ideas"
    )

def create_strategy_task(agent, topic, tone=None, target_audience=None):
    description = f"""
    Based on the research provided, create a content strategy for a LinkedIn post about: {topic}
    """

    if tone:
        description += f"\nDesired tone: {tone}"
    else:
        description += "\nDesired tone: Professional and engaging"

    if target_audience:
        description += f"\nTarget audience: {target_audience}"

    description += """

    Provide:
    1. Content strategy outline including:
       - Hook strategy (how to grab attention in first 3 lines)
       - Main body structure (key points to cover)
       - Call-to-action approach
    2. Tone guidelines and voice characteristics
    3. Length recommendations for LinkedIn
    4. Engagement tactics to incorporate

    Format your response as a detailed content brief.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output="A detailed content strategy with hook, body, CTA structure and tone guidelines"
    )

def create_writing_task(agent, topic, tone=None, target_audience=None):
    description = f"""
    Write a complete LinkedIn post based on the research and strategy provided for: {topic}
    """

    if tone:
        description += f"\nTone: {tone}"
    if target_audience:
        description += f"\nTarget audience: {target_audience}"

    description += """

    Requirements:
    1. Strong hook that captures attention in the first 3 lines
    2. Engaging storytelling approach
    3. Clear value proposition for the reader
    4. Professional yet authentic voice
    5. Optimal length for LinkedIn (ideally 150-300 words)
    6. Natural flow that encourages reading to the end

    Do NOT include hashtags or explicit CTAs yet - those will be added by the optimizer.
    Focus purely on the core content and narrative.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output="A well-written LinkedIn post with strong hook, engaging body, and professional tone"
    )

def create_editing_task(agent):
    description = """
    Edit and refine the LinkedIn post provided by the writer for:
    1. Grammar, spelling, and punctuation accuracy
    2. Clarity and readability
    3. Flow and logical progression of ideas
    4. Professional tone and language
    5. Conciseness without losing impact
    6. Consistency in voice and style

    Provide the edited version with improvements made.
    Explain any significant changes if they alter meaning or tone.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output="A polished, error-free LinkedIn post with improved clarity and flow"
    )

def create_optimization_task(agent, num_variations=1, include_emojis=True):
    description = f"""
    Optimize the LinkedIn post provided by the editor for maximum algorithm performance and engagement.

    Requirements:
    1. Add relevant hashtags (3-5 optimal for LinkedIn)
    2. Optimize keywords for searchability and relevance
    3. Format for readability (strategic line breaks, spacing)
    4. Add engagement hooks (questions, CTAs) where appropriate
    5. {'Include emojis strategically' if include_emojis else 'Do not include emojis'}
    6. Generate {num_variations} {'variation' if num_variations == 1 else 'variations'} of the optimized post

    For each variation, provide:
    - The optimized post content
    - List of hashtags used
    - Brief explanation of optimization choices

    Ensure optimizations feel natural and not spammy.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output=f"{num_variations} optimized LinkedIn post variation(s) with hashtags, keywords, formatting, and engagement hooks"
    )

def create_scheduling_task(agent):
    description = """
    Determine the optimal posting time for the LinkedIn post and prepare it for scheduling.

    Provide:
    1. Recommended posting date and time (based on typical LinkedIn engagement patterns)
    2. Reasoning for the timing recommendation
    3. Optional: A simple queue system structure for multiple posts
    4. Final post ready for LinkedIn API integration (include all elements: content, hashtags, formatting)

    Format as a scheduling recommendation with the final post ready to publish.
    """

    return Task(
        description=description,
        agent=agent,
        expected_output="Optimal posting time recommendation and final LinkedIn post ready for scheduling"
    )

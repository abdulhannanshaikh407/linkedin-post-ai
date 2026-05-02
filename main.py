import os
import argparse
from datetime import datetime
from crewai import Crew, Process
from dotenv import load_dotenv
from agents import (
    create_research_agent,
    create_content_strategist_agent,
    create_writer_agent,
    create_editor_agent,
    create_content_optimizer_agent,
    create_scheduling_agent
)
from tasks import (
    create_research_task,
    create_strategy_task,
    create_writing_task,
    create_editing_task,
    create_optimization_task,
    create_scheduling_task
)

# Load environment variables
load_dotenv()

def run_linkedin_post_generator(topic, tone=None, target_audience=None, num_variations=1, include_emojis=True):
    """
    Main function to run the LinkedIn post generation pipeline
    """
    print("🚀 Starting LinkedIn Post Generation Pipeline...")
    print(f"📌 Topic: {topic}")
    if tone:
        print(f"🎨 Tone: {tone}")
    if target_audience:
        print(f"👥 Target Audience: {target_audience}")
    print(f"🔢 Variations: {num_variations}")
    print(f"😊 Include Emojis: {include_emojis}")
    print("-" * 50)

    # Create agents
    research_agent = create_research_agent()
    strategist_agent = create_content_strategist_agent()
    writer_agent = create_writer_agent()
    editor_agent = create_editor_agent()
    optimizer_agent = create_content_optimizer_agent()
    scheduler_agent = create_scheduling_agent()

    # Create tasks
    research_task = create_research_task(research_agent, topic, target_audience)
    strategy_task = create_strategy_task(strategist_agent, topic, tone, target_audience)
    writing_task = create_writing_task(writer_agent, topic, tone, target_audience)
    editing_task = create_editing_task(editor_agent)
    optimization_task = create_optimization_task(optimizer_agent, num_variations, include_emojis)
    scheduling_task = create_scheduling_task(scheduler_agent)

    # Create crew and run the process
    crew = Crew(
        agents=[research_agent, strategist_agent, writer_agent, editor_agent, optimizer_agent, scheduler_agent],
        tasks=[research_task, strategy_task, writing_task, editing_task, optimization_task, scheduling_task],
        verbose=True,
        process=Process.sequential  # Tasks run in sequence
    )

    # Execute the crew with error handling
    try:
        result = crew.kickoff()
    except Exception as e:
        raise RuntimeError(f"LinkedIn post generation failed: {str(e)}") from e

    # Save output to timestamped file in outputs/
    os.makedirs("outputs", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_topic = "".join(c for c in topic if c.isalnum() or c in " _-").strip().replace(" ", "_")[:50]
    output_path = os.path.join("outputs", f"{safe_topic}_{timestamp}.txt")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"Topic: {topic}\n")
        f.write(f"Tone: {tone or 'default'}\n")
        f.write(f"Audience: {target_audience or 'default'}\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write("-" * 50 + "\n")
        f.write(str(result))

    print("\n" + "="*50)
    print("🎉 LINKEDIN POST GENERATION COMPLETE!")
    print("="*50)
    print(result)
    print(f"\n💾 Output saved to: {output_path}")

    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LinkedIn Post Generator using CrewAI")
    parser.add_argument("--topic", type=str, required=True, help="Topic for the LinkedIn post")
    parser.add_argument("--tone", type=str, default=None, help="Tone of the post (e.g., professional, casual)")
    parser.add_argument("--audience", type=str, default=None, help="Target audience for the post")
    parser.add_argument("--variations", type=int, default=1, help="Number of post variations to generate")
    parser.add_argument("--no-emojis", action="store_true", help="Disable emojis in the post")
    args = parser.parse_args()

    run_linkedin_post_generator(
        topic=args.topic,
        tone=args.tone,
        target_audience=args.audience,
        num_variations=args.variations,
        include_emojis=not args.no_emojis
    )

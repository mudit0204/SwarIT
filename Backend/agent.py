# from dotenv import load_dotenv
# import os

# from livekit import agents
# from livekit.agents import AgentSession, Agent, RoomInputOptions
# from livekit.plugins import (
#     noise_cancellation,
# )
# from livekit.plugins import google
# from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
# from tools import get_weather, search_web, send_email
# load_dotenv()


# class Assistant(Agent):
#     def __init__(self) -> None:
#         super().__init__(
#             instructions=AGENT_INSTRUCTION,
#             llm=google.beta.realtime.RealtimeModel(
#             voice="Aoede",
#             temperature=0.8,
#         ),
#             tools=[
#                 get_weather,
#                 search_web,
#                 send_email
#             ],

#         )
        


# async def entrypoint(ctx: agents.JobContext):
#     session = AgentSession(
        
#     )

#     await session.start(
#         room=ctx.room,
#         agent=Assistant(),
#         room_input_options=RoomInputOptions(
#             # LiveKit Cloud enhanced noise cancellation
#             # - If self-hosting, omit this parameter
#             # - For telephony applications, use `BVCTelephony` for best results
#             video_enabled=True,
#             noise_cancellation=noise_cancellation.BVC(),
#         ),
#     )

#     await ctx.connect()

#     await session.generate_reply(
#         instructions=SESSION_INSTRUCTION,
#     )


# if __name__ == "__main__":
#     agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))

from dotenv import load_dotenv
import os

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation
from livekit.plugins import google
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from tools import get_weather, search_web, send_email

# Load environment variables from .env
load_dotenv()

LIVEKIT_URL = os.getenv("LIVEKIT_URL")  # e.g. "wss://your-project-id.livekit.cloud"
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")


# Define your Assistant Agent
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            llm=google.beta.realtime.RealtimeModel(
                voice="Aoede",
                temperature=0.8,
            ),
            tools=[
                get_weather,
                search_web,
                send_email,
            ],
        )


# Entrypoint for the Agent Worker
async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            video_enabled=True,
            # Use LiveKit Cloud’s built-in noise cancellation
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Connect to LiveKit Cloud using JobContext
    await ctx.connect()

    # Give session instructions
    await session.generate_reply(
        instructions=SESSION_INSTRUCTION,
    )


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(
            entrypoint_fnc=entrypoint,
            # Pass LiveKit Cloud credentials here
            livekit_url=LIVEKIT_URL,
            api_key=LIVEKIT_API_KEY,
            api_secret=LIVEKIT_API_SECRET,
        )
    )

"""Rephraser Agent - Main Application"""

import os
from fastapi import FastAPI

from src.common.a2a_handler import A2AHandler
from .config import get_agent_card, SYSTEM_PROMPT

# Create FastAPI app
app = FastAPI(
    title="言い換えエージェント",
    description="A2A Protocol Rephraser Agent",
    version="1.0.0"
)

# Initialize A2A handler
agent_card = get_agent_card()
handler = A2AHandler(
    app=app,
    agent_card=agent_card,
    system_prompt=SYSTEM_PROMPT
)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8081"))
    uvicorn.run(app, host="0.0.0.0", port=port)

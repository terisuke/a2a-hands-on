"""A2A Protocol Request Handler"""

from typing import Any, Callable, Awaitable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    A2ARequest,
    A2AResponse,
    A2AError,
    AgentCard,
    Task,
    TaskStatus,
    Artifact,
    MessagePart,
    MessageSendParams,
)
from .llm import LLMClient


class A2AHandler:
    """A2A Protocol Request Handler"""

    def __init__(
        self,
        app: FastAPI,
        agent_card: AgentCard,
        system_prompt: str,
    ):
        self.app = app
        self.agent_card = agent_card
        self.system_prompt = system_prompt

        # Setup CORS
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # Register routes
        self._register_routes()

    def _register_routes(self):
        """Register A2A protocol routes"""

        @self.app.get("/.well-known/agent-card.json")
        async def get_agent_card():
            """Return the Agent Card"""
            return self.agent_card.model_dump()

        @self.app.get("/health")
        async def health_check():
            """Health check endpoint"""
            return {"status": "healthy"}

        @self.app.post("/")
        async def handle_a2a_request(request: Request):
            """Handle A2A JSON-RPC requests"""
            try:
                body = await request.json()
                a2a_request = A2ARequest(**body)

                # Get LLM config from headers
                provider = request.headers.get("X-LLM-Provider", "openai")
                api_key = request.headers.get("X-LLM-API-Key", "")

                if not api_key:
                    return A2AError(
                        id=a2a_request.id,
                        error={
                            "code": -32602,
                            "message": "Invalid params",
                            "data": {"details": "X-LLM-API-Key header is required"},
                        }
                    ).model_dump()

                if a2a_request.method == "message/send":
                    return await self._handle_message_send(
                        a2a_request, provider, api_key
                    )
                else:
                    return A2AError(
                        id=a2a_request.id,
                        error={
                            "code": -32601,
                            "message": "Method not found",
                            "data": {"details": f"Unknown method: {a2a_request.method}"},
                        }
                    ).model_dump()

            except Exception as e:
                return A2AError(
                    id=body.get("id", 0) if isinstance(body, dict) else 0,
                    error={
                        "code": -32603,
                        "message": "Internal error",
                        "data": {"details": str(e)},
                    }
                ).model_dump()

    async def _handle_message_send(
        self,
        request: A2ARequest,
        provider: str,
        api_key: str,
    ) -> dict:
        """Handle message/send method"""
        try:
            params = MessageSendParams(**request.params)

            # Extract text from message parts
            user_text = ""
            for part in params.message.parts:
                if part.kind == "text":
                    user_text += part.text

            if not user_text:
                return A2AError(
                    id=request.id,
                    error={
                        "code": -32602,
                        "message": "Invalid params",
                        "data": {"details": "No text content in message"},
                    }
                ).model_dump()

            # Generate response using LLM
            llm_client = LLMClient(provider=provider, api_key=api_key)
            response_text = await llm_client.generate(self.system_prompt, user_text)

            # Build A2A response
            task = Task(
                status=TaskStatus(state="completed"),
                artifacts=[
                    Artifact(
                        parts=[MessagePart(text=response_text)]
                    )
                ]
            )

            return A2AResponse(
                id=request.id,
                result=task,
            ).model_dump()

        except Exception as e:
            return A2AError(
                id=request.id,
                error={
                    "code": -32603,
                    "message": "Internal error",
                    "data": {"details": str(e)},
                }
            ).model_dump()

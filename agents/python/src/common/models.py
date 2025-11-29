"""A2A Protocol Data Models (v0.3.0)"""

from datetime import datetime
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class MessagePart(BaseModel):
    """A2A Message Part"""
    kind: Literal["text"] = "text"
    text: str


class Message(BaseModel):
    """A2A Message"""
    kind: Literal["message"] = "message"
    messageId: str = Field(default_factory=lambda: str(uuid4()))
    role: Literal["user", "agent"] = "user"
    parts: list[MessagePart]


class Configuration(BaseModel):
    """A2A Request Configuration"""
    acceptedOutputModes: list[str] = ["text/plain"]
    blocking: bool = True


class MessageSendParams(BaseModel):
    """message/send method params"""
    message: Message
    configuration: Configuration = Field(default_factory=Configuration)


class A2ARequest(BaseModel):
    """A2A JSON-RPC Request"""
    jsonrpc: str = "2.0"
    id: int | str
    method: str
    params: dict[str, Any] | None = None


class TaskStatus(BaseModel):
    """Task Status"""
    state: Literal["submitted", "working", "input-required", "completed", "failed", "canceled"] = "completed"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    message: str | None = None


class Artifact(BaseModel):
    """Task Artifact"""
    artifactId: str = Field(default_factory=lambda: str(uuid4()))
    name: str = "response"
    parts: list[MessagePart]


class Task(BaseModel):
    """A2A Task Result"""
    kind: Literal["task"] = "task"
    id: str = Field(default_factory=lambda: str(uuid4()))
    contextId: str = Field(default_factory=lambda: str(uuid4()))
    status: TaskStatus = Field(default_factory=TaskStatus)
    artifacts: list[Artifact] = []


class A2AResponse(BaseModel):
    """A2A JSON-RPC Response"""
    jsonrpc: str = "2.0"
    id: int | str
    result: Task | None = None
    error: dict[str, Any] | None = None


class A2AError(BaseModel):
    """A2A Error Response"""
    jsonrpc: str = "2.0"
    id: int | str
    error: dict[str, Any]


# Agent Card Models

class Provider(BaseModel):
    """Agent Provider Info"""
    organization: str = "A2A Handson"
    url: str = "https://github.com/a2a-handson"


class Capabilities(BaseModel):
    """Agent Capabilities"""
    streaming: bool = False
    pushNotifications: bool = False
    stateTransitionHistory: bool = False


class Skill(BaseModel):
    """Agent Skill"""
    id: str
    name: str
    description: str
    tags: list[str] = []
    examples: list[str] = []
    inputModes: list[str] = ["text/plain"]
    outputModes: list[str] = ["text/plain"]


class AgentCard(BaseModel):
    """A2A Agent Card (v0.3.0)"""
    protocolVersion: str = "0.3.0"
    name: str
    description: str
    url: str
    preferredTransport: Literal["JSONRPC"] = "JSONRPC"
    provider: Provider = Field(default_factory=Provider)
    version: str = "1.0.0"
    capabilities: Capabilities = Field(default_factory=Capabilities)
    defaultInputModes: list[str] = ["text/plain"]
    defaultOutputModes: list[str] = ["text/plain"]
    skills: list[Skill] = []

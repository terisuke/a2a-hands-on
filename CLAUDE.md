# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A2A (Agent-to-Agent) Protocol hands-on workshop system for WAKE Career. The system consists of AI agents that communicate via A2A protocol (JSON-RPC 2.0 over HTTPS), implemented in both Python and TypeScript to demonstrate cross-language interoperability.

## Common Commands

### Python Agents (agents/python/)

```bash
cd agents/python
pip install -r requirements.txt

# Start individual agents
PYTHONPATH=. uvicorn src.encourager.main:app --port 8080  # 励ましエージェント
PYTHONPATH=. uvicorn src.rephraser.main:app --port 8081   # 言い換えエージェント
PYTHONPATH=. uvicorn src.translator.main:app --port 8084  # 翻訳エージェント
PYTHONPATH=. uvicorn src.summarizer.main:app --port 8085  # 要約エージェント
```

### TypeScript Agents (agents/typescript/)

```bash
cd agents/typescript
npm install
npm run build       # Compile TypeScript
npm run test        # Run tests with vitest

# Start individual agents
npm run dev:namer       # 命名エージェント (port 8082)
npm run dev:commit      # コミットメッセージエージェント (port 8083)
npm run dev:reviewer    # レビューエージェント (port 8086)
npm run dev:documenter  # ドキュメントエージェント (port 8087)
```

### UI (ui/)

```bash
cd ui
npm install
npm run dev      # Development server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

### A2A Protocol Flow

```
Browser (React UI) → A2A JSON-RPC Request → Cloud Run Agents → LLM API (OpenAI/Gemini)
```

Each agent exposes:
- `GET /.well-known/agent-card.json` - Agent metadata and capabilities
- `POST /` - A2A JSON-RPC endpoint for message processing
- `GET /health` - Health check

### LLM API Key Handling

API keys are passed via HTTP headers (not stored server-side):
- `X-LLM-Provider`: `openai` or `gemini`
- `X-LLM-API-Key`: User's API key

### Shared Module Patterns

**Python** (`agents/python/src/common/`):
- `a2a_handler.py`: A2AHandler class wraps FastAPI with CORS, routes, and request handling
- `llm.py`: LLMClient for OpenAI/Gemini abstraction
- `models.py`: Pydantic models for A2A protocol types

**TypeScript** (`agents/typescript/src/common/`):
- `a2a-handler.ts`: A2AHandler class wraps Express with identical functionality
- `llm.ts`: LLMClient class
- `types.ts`: TypeScript interfaces for A2A protocol

### Agent Structure

Each agent follows the same pattern:
- `config.ts/py`: AgentCard definition and system prompt
- `main.py` or `index.ts`: Entry point that instantiates A2AHandler

### UI Stack

Next.js 14 (App Router) + shadcn/ui + Tailwind CSS + Monaco Editor. State management via React Context for API key storage.

## Testing Agents

```bash
# Get agent card
curl http://localhost:8080/.well-known/agent-card.json

# Send A2A message
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -H "X-LLM-Provider: openai" \
  -H "X-LLM-API-Key: your-api-key" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "messageId": "test-123",
        "role": "user",
        "parts": [{"kind": "text", "text": "your input"}]
      },
      "configuration": {
        "acceptedOutputModes": ["text/plain"],
        "blocking": true
      }
    }
  }'
```

## Deployment

- **Agents**: Cloud Run (GCP) via `scripts/deploy-agents.sh`
- **UI**: Vercel (auto-deploy, configured in `ui/vercel.json`)

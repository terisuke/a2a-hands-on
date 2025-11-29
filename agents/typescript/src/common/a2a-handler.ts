/**
 * A2A Protocol Request Handler
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { LLMClient } from './llm.js';
import type {
  A2ARequest,
  A2AResponse,
  AgentCard,
  Task,
  MessageSendParams,
  LLMProvider,
} from './types.js';

export class A2AHandler {
  private app: Express;
  private agentCard: AgentCard;
  private systemPrompt: string;

  constructor(app: Express, agentCard: AgentCard, systemPrompt: string) {
    this.app = app;
    this.agentCard = agentCard;
    this.systemPrompt = systemPrompt;

    this.setupMiddleware();
    this.registerRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private registerRoutes(): void {
    // Agent Card endpoint
    this.app.get('/.well-known/agent-card.json', (_req: Request, res: Response) => {
      res.json(this.agentCard);
    });

    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'healthy' });
    });

    // A2A JSON-RPC endpoint
    this.app.post('/', async (req: Request, res: Response) => {
      try {
        const a2aRequest = req.body as A2ARequest;

        // Get LLM config from headers
        const provider = (req.headers['x-llm-provider'] as LLMProvider) || 'openai';
        const apiKey = req.headers['x-llm-api-key'] as string;

        if (!apiKey) {
          res.json(this.createErrorResponse(a2aRequest.id, -32602, 'Invalid params', 'X-LLM-API-Key header is required'));
          return;
        }

        if (a2aRequest.method === 'message/send') {
          const result = await this.handleMessageSend(a2aRequest, provider, apiKey);
          res.json(result);
        } else {
          res.json(this.createErrorResponse(a2aRequest.id, -32601, 'Method not found', `Unknown method: ${a2aRequest.method}`));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.json(this.createErrorResponse(req.body?.id || 0, -32603, 'Internal error', errorMessage));
      }
    });
  }

  private async handleMessageSend(
    request: A2ARequest,
    provider: LLMProvider,
    apiKey: string
  ): Promise<A2AResponse> {
    try {
      const params = request.params as unknown as MessageSendParams;

      // Extract text from message parts
      let userText = '';
      for (const part of params.message.parts) {
        if (part.kind === 'text') {
          userText += part.text;
        }
      }

      if (!userText) {
        return this.createErrorResponse(request.id, -32602, 'Invalid params', 'No text content in message');
      }

      // Generate response using LLM
      const llmClient = new LLMClient(provider, apiKey);
      const responseText = await llmClient.generate(this.systemPrompt, userText);

      // Build A2A response
      const task: Task = {
        kind: 'task',
        id: uuidv4(),
        contextId: uuidv4(),
        status: {
          state: 'completed',
          timestamp: new Date().toISOString(),
        },
        artifacts: [
          {
            artifactId: uuidv4(),
            name: 'response',
            parts: [{ kind: 'text', text: responseText }],
          },
        ],
      };

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: task,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResponse(request.id, -32603, 'Internal error', errorMessage);
    }
  }

  private createErrorResponse(
    id: number | string,
    code: number,
    message: string,
    details: string
  ): A2AResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
        data: { details },
      },
    };
  }

  start(port: number = 8080): void {
    this.app.listen(port, () => {
      console.log(`Agent "${this.agentCard.name}" listening on port ${port}`);
    });
  }
}

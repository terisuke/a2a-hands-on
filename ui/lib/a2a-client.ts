/**
 * A2A Protocol Client for Browser
 */

export interface A2AClientConfig {
  provider: "openai" | "gemini";
  apiKey: string;
}

export interface SendMessageParams {
  agentUrl: string;
  text: string;
}

export interface A2AResponse {
  success: boolean;
  taskId?: string;
  result?: string;
  error?: {
    code: number;
    message: string;
    data?: {
      details: string;
    };
  };
}

export interface AgentCard {
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  preferredTransport: string;
  provider: {
    organization: string;
    url: string;
  };
  version: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
    stateTransitionHistory: boolean;
  };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    examples: string[];
    inputModes: string[];
    outputModes: string[];
  }>;
}

export async function sendMessage(
  config: A2AClientConfig,
  params: SendMessageParams
): Promise<A2AResponse> {
  try {
    const response = await fetch(params.agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LLM-Provider": config.provider,
        "X-LLM-API-Key": config.apiKey,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "message/send",
        params: {
          message: {
            kind: "message",
            messageId: crypto.randomUUID(),
            role: "user",
            parts: [{ kind: "text", text: params.text }],
          },
          configuration: {
            acceptedOutputModes: ["text/plain"],
            blocking: true,
          },
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        error: data.error,
      };
    }

    return {
      success: true,
      taskId: data.result?.id,
      result: data.result?.artifacts?.[0]?.parts?.[0]?.text,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: -32603,
        message: "Network error",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      },
    };
  }
}

export async function fetchAgentCard(agentUrl: string): Promise<AgentCard> {
  const cardUrl = new URL("/.well-known/agent-card.json", agentUrl);
  const response = await fetch(cardUrl.toString());
  return response.json();
}

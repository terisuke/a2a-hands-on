/**
 * A2A Protocol Types (v0.3.0)
 */

// Message Types
export interface MessagePart {
  kind: 'text';
  text: string;
}

export interface Message {
  kind: 'message';
  messageId: string;
  role: 'user' | 'agent';
  parts: MessagePart[];
}

export interface Configuration {
  acceptedOutputModes: string[];
  blocking: boolean;
}

export interface MessageSendParams {
  message: Message;
  configuration?: Configuration;
}

// JSON-RPC Types
export interface A2ARequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

export interface TaskStatus {
  state: 'submitted' | 'working' | 'input-required' | 'completed' | 'failed' | 'canceled';
  timestamp: string;
  message?: string;
}

export interface Artifact {
  artifactId: string;
  name: string;
  parts: MessagePart[];
}

export interface Task {
  kind: 'task';
  id: string;
  contextId: string;
  status: TaskStatus;
  artifacts: Artifact[];
}

export interface A2AResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: Task;
  error?: A2AErrorData;
}

export interface A2AErrorData {
  code: number;
  message: string;
  data?: {
    details: string;
  };
}

// Agent Card Types
export interface Provider {
  organization: string;
  url: string;
}

export interface Capabilities {
  streaming: boolean;
  pushNotifications: boolean;
  stateTransitionHistory: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples: string[];
  inputModes: string[];
  outputModes: string[];
}

export interface AgentCard {
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  preferredTransport: 'JSONRPC';
  provider: Provider;
  version: string;
  capabilities: Capabilities;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: Skill[];
}

// LLM Types
export type LLMProvider = 'openai' | 'gemini';

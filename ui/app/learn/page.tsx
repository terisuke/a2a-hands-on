"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learn A2A Protocol</h1>
        <p className="text-muted-foreground mt-2">
          A2A (Agent-to-Agent) プロトコルの仕組みを学びましょう。
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="agent-card">Agent Card</TabsTrigger>
          <TabsTrigger value="json-rpc">JSON-RPC</TabsTrigger>
          <TabsTrigger value="example">実装例</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>A2Aプロトコルとは</CardTitle>
              <CardDescription>
                Agent-to-Agent Protocol の基本概念
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">概要</h3>
                <p className="text-sm text-muted-foreground">
                  A2Aは、異なるAIエージェント同士が標準化された方法で通信するためのオープンプロトコルです。
                  Googleが2025年4月に公開し、様々なエージェントフレームワークで採用されています。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">主な特徴</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <strong>標準化:</strong> JSON-RPC 2.0ベースの統一されたインターフェース
                  </li>
                  <li>
                    <strong>発見可能性:</strong> Agent Cardによるエージェント情報の公開
                  </li>
                  <li>
                    <strong>相互運用性:</strong> 異なる言語・フレームワークで実装されたエージェント間の通信
                  </li>
                  <li>
                    <strong>拡張性:</strong> スキルやCapabilitiesによる機能の明示
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">プロトコルバージョン</h3>
                <p className="text-sm text-muted-foreground">
                  このハンズオンではA2A v0.3.0を使用しています。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent-card">
          <Card>
            <CardHeader>
              <CardTitle>Agent Card</CardTitle>
              <CardDescription>
                エージェントのメタ情報を公開するJSON形式の仕様
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">役割</h3>
                <p className="text-sm text-muted-foreground">
                  Agent Cardは、エージェントの能力や使い方を他のエージェントやクライアントに伝えるための仕様です。
                  <code className="mx-1 px-1 bg-muted rounded">
                    /.well-known/agent-card.json
                  </code>
                  エンドポイントで公開されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">構造</h3>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`{
  "protocolVersion": "0.3.0",
  "name": "エージェント名",
  "description": "エージェントの説明",
  "url": "https://agent.example.com",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "組織名",
    "url": "https://example.com"
  },
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false,
    "stateTransitionHistory": false
  },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"],
  "skills": [
    {
      "id": "skill-id",
      "name": "スキル名",
      "description": "スキルの説明",
      "tags": ["tag1", "tag2"],
      "examples": ["入力例1", "入力例2"],
      "inputModes": ["text/plain"],
      "outputModes": ["text/plain"]
    }
  ]
}`}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-semibold mb-2">主要フィールド</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <strong>protocolVersion:</strong> 使用しているA2Aプロトコルのバージョン
                  </li>
                  <li>
                    <strong>capabilities:</strong> エージェントがサポートする機能
                  </li>
                  <li>
                    <strong>skills:</strong> エージェントが提供するスキル（機能）の一覧
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json-rpc">
          <Card>
            <CardHeader>
              <CardTitle>JSON-RPC 2.0</CardTitle>
              <CardDescription>
                A2Aで使用する通信プロトコル
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">message/send リクエスト</h3>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "messageId": "uuid-here",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "入力テキスト"
        }
      ]
    },
    "configuration": {
      "acceptedOutputModes": ["text/plain"],
      "blocking": true
    }
  }
}`}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-semibold mb-2">レスポンス（成功時）</h3>
                <ScrollArea className="h-[250px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "kind": "task",
    "id": "task-uuid",
    "contextId": "context-uuid",
    "status": {
      "state": "completed",
      "timestamp": "2026-01-14T19:30:00Z"
    },
    "artifacts": [
      {
        "artifactId": "artifact-uuid",
        "name": "response",
        "parts": [
          {
            "kind": "text",
            "text": "エージェントからの応答"
          }
        ]
      }
    ]
  }
}`}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-semibold mb-2">エラーレスポンス</h3>
                <ScrollArea className="h-[120px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": { "details": "エラーの詳細" }
  }
}`}
                  </pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="example">
          <Card>
            <CardHeader>
              <CardTitle>実装例</CardTitle>
              <CardDescription>
                JavaScript/TypeScriptでのA2Aクライアント実装
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">メッセージ送信関数</h3>
                <ScrollArea className="h-[350px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`async function sendMessage(agentUrl, text, config) {
  const response = await fetch(agentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-LLM-Provider': config.provider, // 'openai' or 'gemini'
      'X-LLM-API-Key': config.apiKey,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'message/send',
      params: {
        message: {
          kind: 'message',
          messageId: crypto.randomUUID(),
          role: 'user',
          parts: [{ kind: 'text', text }],
        },
        configuration: {
          acceptedOutputModes: ['text/plain'],
          blocking: true,
        },
      },
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result.artifacts[0].parts[0].text;
}`}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-semibold mb-2">エージェント連携例</h3>
                <ScrollArea className="h-[150px] rounded-md border p-4">
                  <pre className="text-sm font-mono">
{`// 励ましエージェントの出力を言い換えエージェントに渡す
const encouragement = await sendMessage(
  'https://encourager.example.com',
  '今日は失敗ばかりだった',
  config
);

const rephrased = await sendMessage(
  'https://rephraser.example.com',
  encouragement,
  config
);

console.log(rephrased);`}
                  </pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

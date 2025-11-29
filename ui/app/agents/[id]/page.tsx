"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentTester } from "@/components/agent-tester";
import { useApp } from "@/contexts/app-context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const agentData: Record<
  string,
  {
    name: string;
    description: string;
    language: string;
    skillId: string;
    tags: string[];
    examples: string[];
    agentCard: object;
  }
> = {
  encourager: {
    name: "励ましエージェント",
    description:
      "あなたの悩みや困難に共感し、温かい励ましのメッセージを返します。",
    language: "Python",
    skillId: "encourage",
    tags: ["encouragement", "support", "mental-health", "empathy"],
    examples: [
      "今日のコードレビュー、厳しい指摘をもらった",
      "プレゼンで頭が真っ白になった",
      "締め切りに間に合わなかった",
    ],
    agentCard: {
      protocolVersion: "0.3.0",
      name: "励ましエージェント",
      description: "あなたの悩みや困難に共感し、温かい励ましのメッセージを返します。",
      preferredTransport: "JSONRPC",
      provider: {
        organization: "A2A Handson",
        url: "https://github.com/a2a-handson",
      },
      version: "1.0.0",
      capabilities: {
        streaming: false,
        pushNotifications: false,
        stateTransitionHistory: false,
      },
      defaultInputModes: ["text/plain"],
      defaultOutputModes: ["text/plain"],
      skills: [
        {
          id: "encourage",
          name: "励まし",
          description: "入力テキストに対して共感と励ましのメッセージを返します",
          tags: ["encouragement", "support", "mental-health", "empathy"],
          examples: [
            "今日のコードレビュー、厳しい指摘をもらった",
            "プレゼンで頭が真っ白になった",
          ],
          inputModes: ["text/plain"],
          outputModes: ["text/plain"],
        },
      ],
    },
  },
  rephraser: {
    name: "言い換えエージェント",
    description:
      "攻撃的な表現や冷たい言い方を、マイルドで建設的な表現に言い換えます。",
    language: "Python",
    skillId: "rephrase",
    tags: ["communication", "rewrite", "soft-skills", "business"],
    examples: [
      "なんでこんな簡単なこともできないの？",
      "このコード、全然ダメ",
      "もう何回同じこと言わせるの",
    ],
    agentCard: {
      protocolVersion: "0.3.0",
      name: "言い換えエージェント",
      description: "攻撃的な表現をマイルドで建設的な表現に言い換えます。",
      preferredTransport: "JSONRPC",
      provider: {
        organization: "A2A Handson",
        url: "https://github.com/a2a-handson",
      },
      version: "1.0.0",
      capabilities: {
        streaming: false,
        pushNotifications: false,
        stateTransitionHistory: false,
      },
      defaultInputModes: ["text/plain"],
      defaultOutputModes: ["text/plain"],
      skills: [
        {
          id: "rephrase",
          name: "言い換え",
          description: "攻撃的・冷たい文章をマイルドで丁寧な表現に変換します",
          tags: ["communication", "rewrite", "soft-skills", "business"],
          examples: ["なんでこんな簡単なこともできないの？", "このコード、全然ダメ"],
          inputModes: ["text/plain"],
          outputModes: ["text/plain"],
        },
      ],
    },
  },
  namer: {
    name: "命名エージェント",
    description:
      "機能の説明から、適切な変数名・関数名・クラス名の候補を提案します。",
    language: "TypeScript",
    skillId: "naming",
    tags: ["naming", "coding", "developer-tools", "programming"],
    examples: [
      "ユーザーのメールアドレスを検証する関数",
      "商品の合計金額を計算する",
      "ログイン状態を保持する変数",
    ],
    agentCard: {
      protocolVersion: "0.3.0",
      name: "命名エージェント",
      description: "機能の説明から変数名・関数名の候補を提案します。",
      preferredTransport: "JSONRPC",
      provider: {
        organization: "A2A Handson",
        url: "https://github.com/a2a-handson",
      },
      version: "1.0.0",
      capabilities: {
        streaming: false,
        pushNotifications: false,
        stateTransitionHistory: false,
      },
      defaultInputModes: ["text/plain"],
      defaultOutputModes: ["text/plain"],
      skills: [
        {
          id: "naming",
          name: "命名提案",
          description: "機能の説明から変数名・関数名の候補を4〜6個提案します",
          tags: ["naming", "coding", "developer-tools", "programming"],
          examples: ["ユーザーのメールアドレスを検証する関数", "商品の合計金額を計算する"],
          inputModes: ["text/plain"],
          outputModes: ["text/plain"],
        },
      ],
    },
  },
  commit: {
    name: "コミットメッセージエージェント",
    description:
      "変更内容の説明から、Conventional Commits形式のGitコミットメッセージを生成します。",
    language: "TypeScript",
    skillId: "commit-message",
    tags: ["git", "commit", "developer-tools", "version-control"],
    examples: [
      "ログイン画面のバリデーションを追加した",
      "パフォーマンス改善のためにキャッシュを導入",
      "READMEにインストール手順を追記",
    ],
    agentCard: {
      protocolVersion: "0.3.0",
      name: "コミットメッセージエージェント",
      description: "Conventional Commits形式のコミットメッセージを生成します。",
      preferredTransport: "JSONRPC",
      provider: {
        organization: "A2A Handson",
        url: "https://github.com/a2a-handson",
      },
      version: "1.0.0",
      capabilities: {
        streaming: false,
        pushNotifications: false,
        stateTransitionHistory: false,
      },
      defaultInputModes: ["text/plain"],
      defaultOutputModes: ["text/plain"],
      skills: [
        {
          id: "commit-message",
          name: "コミットメッセージ生成",
          description: "変更内容からConventional Commits形式のコミットメッセージを生成します",
          tags: ["git", "commit", "developer-tools", "version-control"],
          examples: ["ログイン画面のバリデーションを追加した"],
          inputModes: ["text/plain"],
          outputModes: ["text/plain"],
        },
      ],
    },
  },
};

export default function AgentDetailPage() {
  const params = useParams();
  const { agents } = useApp();
  const agentId = params.id as string;
  const agent = agentData[agentId];

  if (!agent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Agent not found</h1>
        <Link href="/agents">
          <Button variant="link">Back to agents</Button>
        </Link>
      </div>
    );
  }

  const agentUrl = agents[agentId as keyof typeof agents];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/agents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
          <p className="text-muted-foreground mt-2">{agent.description}</p>
        </div>
        <Badge variant={agent.language === "Python" ? "default" : "secondary"}>
          {agent.language}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {agent.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="test" className="space-y-4">
        <TabsList>
          <TabsTrigger value="test">Test Agent</TabsTrigger>
          <TabsTrigger value="agent-card">Agent Card</TabsTrigger>
        </TabsList>

        <TabsContent value="test">
          <AgentTester
            agentId={agentId}
            agentUrl={agentUrl}
            examples={agent.examples}
          />
        </TabsContent>

        <TabsContent value="agent-card">
          <Card>
            <CardHeader>
              <CardTitle>Agent Card (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono">
                  {JSON.stringify({ ...agent.agentCard, url: agentUrl }, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

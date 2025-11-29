"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { useApp } from "@/contexts/app-context";
import { ArrowRight, Key, Bot, Code, BookOpen, CheckCircle } from "lucide-react";

export default function Home() {
  const { isApiKeySet, llmProvider } = useApp();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          A2A Protocol Hands-on
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Agent-to-Agent Protocol (A2A) を体験するハンズオンワークショップへようこそ。
          AIエージェント同士が連携する世界を体験しましょう。
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Key className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Step 1</CardTitle>
            <CardDescription>APIキーを設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              OpenAI または Google Gemini のAPIキーを設定して始めましょう。
            </p>
            <div className="flex items-center gap-2">
              {isApiKeySet ? (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {llmProvider === "openai" ? "OpenAI" : "Gemini"} 設定済み
                </span>
              ) : (
                <Button size="sm" onClick={() => setShowApiKeyDialog(true)}>
                  設定する
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Bot className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Step 2</CardTitle>
            <CardDescription>エージェントを試す</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              4つのエージェントをそれぞれ単体で試してみましょう。
            </p>
            <Link href="/agents">
              <Button size="sm" variant="outline">
                エージェント一覧へ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Step 3</CardTitle>
            <CardDescription>連携させる</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Playgroundでエージェント同士を連携させてみましょう。
            </p>
            <Link href="/playground">
              <Button size="sm" variant="outline">
                Playgroundへ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Step 4</CardTitle>
            <CardDescription>仕組みを学ぶ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              A2Aプロトコルの仕組みを詳しく学びましょう。
            </p>
            <Link href="/learn">
              <Button size="sm" variant="outline">
                学習ページへ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">A2Aとは？</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Agent-to-Agent Protocol</h3>
            <p className="text-sm text-muted-foreground">
              A2Aは、異なるAIエージェント同士が標準化された方法で通信するためのオープンプロトコルです。
              これにより、様々なエージェントを組み合わせて複雑なタスクを実現できます。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">このハンズオンで学べること</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>- A2Aプロトコルの基本概念</li>
              <li>- Agent Cardによるエージェント情報の公開</li>
              <li>- JSON-RPCによるメッセージ送信</li>
              <li>- 複数エージェントの連携パターン</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">利用可能なエージェント</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">励ましエージェント</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                悩みに共感し、温かい励ましを返します
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">言い換えエージェント</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                攻撃的な表現をマイルドに変換します
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">命名エージェント</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                変数名・関数名の候補を提案します
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">コミットメッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gitコミットメッセージを生成します
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <ApiKeyDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} />
    </div>
  );
}

"use client";

import { AgentCard, AgentInfo } from "@/components/agent-card";

const agents: AgentInfo[] = [
  {
    id: "encourager",
    name: "励ましエージェント",
    description:
      "あなたの悩みや困難に共感し、温かい励ましのメッセージを返します。コードレビューで落ち込んだ時、プレゼンで失敗した時などに使ってください。",
    language: "Python",
    skillId: "encourage",
    tags: ["encouragement", "support", "mental-health", "empathy"],
    examples: [
      "今日のコードレビュー、厳しい指摘をもらった",
      "プレゼンで頭が真っ白になった",
      "締め切りに間に合わなかった",
    ],
  },
  {
    id: "rephraser",
    name: "言い換えエージェント",
    description:
      "攻撃的な表現や冷たい言い方を、マイルドで建設的な表現に言い換えます。Slackで送る前のチェックや、フィードバックの言い方を柔らかくしたい時に使ってください。",
    language: "Python",
    skillId: "rephrase",
    tags: ["communication", "rewrite", "soft-skills", "business"],
    examples: [
      "なんでこんな簡単なこともできないの？",
      "このコード、全然ダメ",
      "もう何回同じこと言わせるの",
    ],
  },
  {
    id: "translator",
    name: "翻訳エージェント",
    description:
      "日本語のテキストを英語に翻訳します。技術文書やコードのコメントを英語化したい時に使ってください。",
    language: "Python",
    skillId: "translate-ja-en",
    tags: ["translation", "japanese", "english", "i18n"],
    examples: [
      "ユーザーのログイン状態を管理する関数",
      "このクラスはデータベース接続を担当します",
      "エラー処理を追加してください",
    ],
  },
  {
    id: "summarizer",
    name: "要約エージェント",
    description:
      "長いテキストを簡潔に要約します。ドキュメントの概要作成や、長文レビューのポイント抽出に使ってください。",
    language: "Python",
    skillId: "summarize",
    tags: ["summarization", "text-processing", "nlp"],
    examples: [
      "長いコードレビューコメントの要約",
      "ミーティング議事録のポイント抽出",
      "技術ドキュメントの概要作成",
    ],
  },
  {
    id: "namer",
    name: "命名エージェント",
    description:
      "機能の説明から、適切な変数名・関数名・クラス名の候補を提案します。命名で30分悩む問題を解決します。",
    language: "TypeScript",
    skillId: "naming",
    tags: ["naming", "coding", "developer-tools", "programming"],
    examples: [
      "ユーザーのメールアドレスを検証する関数",
      "商品の合計金額を計算する",
      "ログイン状態を保持する変数",
    ],
  },
  {
    id: "commit",
    name: "コミットメッセージエージェント",
    description:
      '変更内容の説明から、Conventional Commits形式のGitコミットメッセージを生成します。「fix」「update」で済ませがちな人におすすめ。',
    language: "TypeScript",
    skillId: "commit-message",
    tags: ["git", "commit", "developer-tools", "version-control"],
    examples: [
      "ログイン画面のバリデーションを追加した",
      "パフォーマンス改善のためにキャッシュを導入",
      "READMEにインストール手順を追記",
    ],
  },
  {
    id: "reviewer",
    name: "レビューエージェント",
    description:
      "コードや実装の説明に対して、建設的なレビューコメントを提供します。セルフレビューの補助や、レビュー観点の学習に使ってください。",
    language: "TypeScript",
    skillId: "code-review",
    tags: ["review", "code-quality", "best-practices", "developer-tools"],
    examples: [
      "ユーザー認証のロジックをチェックして",
      "このAPIエンドポイントの実装をレビューして",
      "エラーハンドリングの改善点を教えて",
    ],
  },
  {
    id: "documenter",
    name: "ドキュメントエージェント",
    description:
      "関数やクラスの説明から、わかりやすい技術ドキュメントを生成します。READMEやAPIドキュメントの作成に使ってください。",
    language: "TypeScript",
    skillId: "generate-docs",
    tags: ["documentation", "technical-writing", "developer-tools"],
    examples: [
      "fetchUserDataという関数のドキュメントを書いて",
      "このAPIエンドポイントのドキュメントを作成して",
      "クラスの使い方を説明するドキュメントを生成して",
    ],
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
        <p className="text-muted-foreground mt-2">
          利用可能なA2Aエージェント一覧です。各エージェントをクリックして詳細を確認し、実際に試してみましょう。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

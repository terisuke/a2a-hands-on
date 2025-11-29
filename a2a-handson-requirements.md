# A2A入門ハンズオン システム要件定義書

## 1. プロジェクト概要

### 1.1 目的
女性エンジニア向け技術コミュニティ「WAKE Career」主催のA2A（Agent-to-Agent）プロトコル入門ハンズオンで使用するシステムを構築する。

### 1.2 イベント情報
- **日時**: 2026年1月14日（水）19:00〜21:00
- **ハンズオン時間**: 60分
- **参加者数**: 最大35名
- **参加者レベル**: Python または Node.js の基礎知識がある方

### 1.3 ハンズオンのゴール
- A2Aプロトコルの仕組み・役割をざっくり理解し、実務での活用イメージを持ち帰れる
- AIエージェントを「単体で使う」から「連携させて使う」段階へステップアップできる
- 異なる言語（Python/TypeScript）で作られたエージェントがA2Aで連携できることを体感する

### 1.4 設計方針
- **環境構築ゼロ**: 参加者はブラウザのみで完結（ローカル環境不要）
- **事前デプロイ**: エージェントはCloud Runにデプロイ済み
- **公式準拠**: A2Aプロトコル公式仕様（v0.3.0）に準拠
- **自分のAPIキーで動作**: 参加者が自身のOpenAI/Gemini APIキーを使用

---

## 2. システム構成

### 2.1 全体構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                      参加者のブラウザ                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  React UI (Vercel)                        │  │
│  │  ┌─────────────┬─────────────┬─────────────┬───────────┐  │  │
│  │  │ APIキー設定  │ エージェント │ コード      │ Agent Card│  │  │
│  │  │ ページ      │ 一覧・単体   │ エディタ    │ 閲覧      │  │  │
│  │  └─────────────┴─────────────┴─────────────┴───────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ A2A Protocol (JSON-RPC 2.0 over HTTPS)
                              │ + X-LLM-Provider / X-LLM-API-Key ヘッダー
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Cloud Run (GCP)                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │    Python エージェント    │  │  TypeScript エージェント  │    │
│  │  ┌────────┐ ┌────────┐   │  │  ┌────────┐ ┌────────┐   │    │
│  │  │励まし  │ │言い換え│   │  │  │ 命名   │ │コミット│   │    │
│  │  │Agent   │ │Agent   │   │  │  │ Agent  │ │Agent   │   │    │
│  │  └────────┘ └────────┘   │  │  └────────┘ └────────┘   │    │
│  └──────────────────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ LLM API呼び出し
                              ▼
              ┌───────────────┴───────────────┐
              │                               │
        ┌─────▼─────┐                 ┌───────▼───────┐
        │  OpenAI   │                 │ Google Gemini │
        │    API    │                 │     API       │
        └───────────┘                 └───────────────┘
```

### 2.2 コンポーネント一覧

| コンポーネント | 技術スタック | デプロイ先 | 役割 |
|--------------|-------------|-----------|------|
| React UI | Next.js + shadcn/ui + Monaco Editor | Vercel | 参加者が操作するWebアプリ |
| 励ましエージェント | Python + a2a-sdk + FastAPI | Cloud Run | 共感・励ましメッセージ生成 |
| 言い換えエージェント | Python + a2a-sdk + FastAPI | Cloud Run | 攻撃的文章をマイルドに変換 |
| 命名エージェント | TypeScript + @a2a-js/sdk + Express | Cloud Run | 変数名・関数名候補を提案 |
| コミットメッセージエージェント | TypeScript + @a2a-js/sdk + Express | Cloud Run | Gitコミットメッセージ生成 |

---

## 3. A2Aプロトコル仕様

### 3.1 プロトコル基本情報

| 項目 | 値 |
|------|-----|
| プロトコルバージョン | 0.3.0 |
| トランスポート | JSON-RPC 2.0 over HTTPS |
| データフォーマット | application/json |
| ストリーミング | 今回は非対応（シンプル化のため） |

### 3.2 エンドポイント

各エージェントは以下のエンドポイントを公開する：

| パス | メソッド | 説明 |
|------|---------|------|
| `/.well-known/agent-card.json` | GET | Agent Card（エージェントのメタ情報）を返す |
| `/` | POST | A2A JSON-RPCリクエストを受け付ける |

### 3.3 Agent Card 形式

```json
{
  "protocolVersion": "0.3.0",
  "name": "エージェント名",
  "description": "エージェントの説明",
  "url": "https://agent-xxx.run.app",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "A2A Handson",
    "url": "https://github.com/your-repo"
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
}
```

### 3.4 JSON-RPC リクエスト形式

#### message/send リクエスト

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "messageId": "550e8400-e29b-41d4-a716-446655440000",
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
}
```

#### message/send レスポンス（成功時）

```json
{
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
            "text": "エージェントからの応答テキスト"
          }
        ]
      }
    ]
  }
}
```

#### エラーレスポンス

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "details": "エラーの詳細"
    }
  }
}
```

### 3.5 LLM APIキーの受け渡し

参加者のAPIキーはHTTPヘッダーで渡す（A2A拡張）：

| ヘッダー名 | 値 | 説明 |
|-----------|-----|------|
| `X-LLM-Provider` | `openai` または `gemini` | 使用するLLMプロバイダー |
| `X-LLM-API-Key` | APIキー文字列 | 参加者のAPIキー |

---

## 4. エージェント仕様（Python）

### 4.1 共通技術仕様

| 項目 | 値 |
|------|-----|
| 言語 | Python 3.11+ |
| フレームワーク | FastAPI (Starlette) |
| A2A SDK | `a2a-sdk[http-server]` |
| LLMライブラリ | `openai`, `google-generativeai` |
| コンテナ | Docker |
| デプロイ | Cloud Run |

### 4.2 励ましエージェント（Encourager Agent）

#### 基本情報

| 項目 | 値 |
|------|-----|
| サービス名 | `a2a-agent-encourager` |
| skill.id | `encourage` |
| 説明 | テキストを受け取り、共感と励ましのメッセージを返す |

#### Agent Card

```json
{
  "protocolVersion": "0.3.0",
  "name": "励ましエージェント",
  "description": "あなたの悩みや困難に共感し、温かい励ましのメッセージを返します。コードレビューで落ち込んだ時、プレゼンで失敗した時などに使ってください。",
  "url": "https://a2a-agent-encourager-xxxxx.run.app",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "A2A Handson",
    "url": "https://github.com/your-repo"
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
      "id": "encourage",
      "name": "励まし",
      "description": "入力テキストに対して共感と励ましのメッセージを返します",
      "tags": ["encouragement", "support", "mental-health", "empathy"],
      "examples": [
        "今日のコードレビュー、厳しい指摘をもらった",
        "プレゼンで頭が真っ白になった",
        "締め切りに間に合わなかった"
      ],
      "inputModes": ["text/plain"],
      "outputModes": ["text/plain"]
    }
  ]
}
```

#### システムプロンプト

```
あなたは優しく共感力のあるサポーターです。
ユーザーが困難な状況や失敗を共有したとき、以下を行ってください：

1. まず共感を示す（「辛かったですね」「大変でしたね」など）
2. ポジティブな視点を提供する
3. 具体的な励ましの言葉をかける

回答は3〜5文程度で、温かみのある日本語で返してください。
説教や「こうすべきだった」という指摘は避け、相手の気持ちに寄り添ってください。
```

#### 入出力例

| 入力 | 出力 |
|------|------|
| 今日のコードレビュー、厳しい指摘をもらった | コードレビューで厳しい指摘をもらうと、本当に落ち込みますよね。でも、それはあなたの成長を期待されている証拠でもあります。指摘を受けたということは、改善のチャンスを得たということ。一つずつ取り組んでいけば、必ず力になります。今日も頑張った自分を褒めてあげてください。 |

### 4.3 言い換えエージェント（Rephraser Agent）

#### 基本情報

| 項目 | 値 |
|------|-----|
| サービス名 | `a2a-agent-rephraser` |
| skill.id | `rephrase` |
| 説明 | 攻撃的・冷たい文章をマイルドで丁寧な表現に変換する |

#### Agent Card

```json
{
  "protocolVersion": "0.3.0",
  "name": "言い換えエージェント",
  "description": "攻撃的な表現や冷たい言い方を、マイルドで建設的な表現に言い換えます。Slackで送る前のチェックや、フィードバックの言い方を柔らかくしたい時に使ってください。",
  "url": "https://a2a-agent-rephraser-xxxxx.run.app",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "A2A Handson",
    "url": "https://github.com/your-repo"
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
      "id": "rephrase",
      "name": "言い換え",
      "description": "攻撃的・冷たい文章をマイルドで丁寧な表現に変換します",
      "tags": ["communication", "rewrite", "soft-skills", "business"],
      "examples": [
        "なんでこんな簡単なこともできないの？",
        "このコード、全然ダメ",
        "もう何回同じこと言わせるの"
      ],
      "inputModes": ["text/plain"],
      "outputModes": ["text/plain"]
    }
  ]
}
```

#### システムプロンプト

```
あなたはコミュニケーションの専門家です。
入力された文章を、以下の基準でより良い表現に言い換えてください：

1. 攻撃的な表現を取り除く
2. 相手を責めるのではなく、建設的な提案にする
3. 丁寧で温かみのある表現にする
4. 元の意図は保ちながら、受け手が傷つかない表現にする

言い換えた文章のみを返してください。説明は不要です。
```

#### 入出力例

| 入力 | 出力 |
|------|------|
| なんでこんな簡単なこともできないの？ | この部分、少し難しかったかもしれませんね。一緒に確認してみましょうか？ |
| このコード、全然ダメ | このコードにはいくつか改善できるポイントがありそうです。一緒に見直してみましょう。 |

---

## 5. エージェント仕様（TypeScript）

### 5.1 共通技術仕様

| 項目 | 値 |
|------|-----|
| 言語 | TypeScript 5.x |
| ランタイム | Node.js 20+ |
| フレームワーク | Express.js |
| A2A SDK | `@a2a-js/sdk` |
| LLMライブラリ | `openai`, `@google/generative-ai` |
| コンテナ | Docker |
| デプロイ | Cloud Run |

### 5.2 命名エージェント（Namer Agent）

#### 基本情報

| 項目 | 値 |
|------|-----|
| サービス名 | `a2a-agent-namer` |
| skill.id | `naming` |
| 説明 | 変数名・関数名・クラス名の候補を提案する |

#### Agent Card

```json
{
  "protocolVersion": "0.3.0",
  "name": "命名エージェント",
  "description": "機能の説明から、適切な変数名・関数名・クラス名の候補を提案します。命名で30分悩む問題を解決します。",
  "url": "https://a2a-agent-namer-xxxxx.run.app",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "A2A Handson",
    "url": "https://github.com/your-repo"
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
      "id": "naming",
      "name": "命名提案",
      "description": "機能の説明から変数名・関数名の候補を4〜6個提案します",
      "tags": ["naming", "coding", "developer-tools", "programming"],
      "examples": [
        "ユーザーのメールアドレスを検証する関数",
        "商品の合計金額を計算する",
        "ログイン状態を保持する変数"
      ],
      "inputModes": ["text/plain"],
      "outputModes": ["text/plain"]
    }
  ]
}
```

#### システムプロンプト

```
あなたはプログラミングの命名規則に精通したエンジニアです。
ユーザーが説明した機能に対して、適切な名前の候補を4〜6個提案してください。

ルール：
1. camelCase と snake_case の両方で提案
2. 英語で、意味が明確に伝わる名前
3. 短すぎず長すぎない（2〜4単語程度）
4. 一般的なコーディング規約に沿った名前

以下の形式で返してください：
## 関数名/変数名の候補

1. `candidateName1` - 簡単な説明
2. `candidate_name_2` - 簡単な説明
...
```

#### 入出力例

| 入力 | 出力 |
|------|------|
| ユーザーのメールアドレスを検証する関数 | ## 関数名の候補<br><br>1. `validateEmail` - シンプルで一般的<br>2. `isValidEmailAddress` - boolean を返す場合に適切<br>3. `checkEmailFormat` - フォーマットチェックを強調<br>4. `verify_user_email` - snake_case版<br>5. `validateEmailAddress` - 完全な名称 |

### 5.3 コミットメッセージエージェント（Commit Message Agent）

#### 基本情報

| 項目 | 値 |
|------|-----|
| サービス名 | `a2a-agent-commit` |
| skill.id | `commit-message` |
| 説明 | 変更内容の説明からGitコミットメッセージを生成する |

#### Agent Card

```json
{
  "protocolVersion": "0.3.0",
  "name": "コミットメッセージエージェント",
  "description": "変更内容の説明から、Conventional Commits形式のGitコミットメッセージを生成します。「fix」「update」で済ませがちな人におすすめ。",
  "url": "https://a2a-agent-commit-xxxxx.run.app",
  "preferredTransport": "JSONRPC",
  "provider": {
    "organization": "A2A Handson",
    "url": "https://github.com/your-repo"
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
      "id": "commit-message",
      "name": "コミットメッセージ生成",
      "description": "変更内容からConventional Commits形式のコミットメッセージを生成します",
      "tags": ["git", "commit", "developer-tools", "version-control"],
      "examples": [
        "ログイン画面のバリデーションを追加した",
        "パフォーマンス改善のためにキャッシュを導入",
        "READMEにインストール手順を追記"
      ],
      "inputModes": ["text/plain"],
      "outputModes": ["text/plain"]
    }
  ]
}
```

#### システムプロンプト

```
あなたはGitのコミットメッセージを作成する専門家です。
ユーザーが説明した変更内容から、Conventional Commits形式のコミットメッセージを生成してください。

フォーマット：
<type>: <subject>

<body（変更の詳細を箇条書きで）>

typeの種類：
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット（コードの動作に影響しない変更）
- refactor: リファクタリング
- perf: パフォーマンス改善
- test: テスト追加・修正
- chore: ビルドプロセスやツールの変更

日本語で、簡潔かつ明確なメッセージを返してください。
```

#### 入出力例

| 入力 | 出力 |
|------|------|
| ログイン画面のバリデーションを追加した | feat: ログイン画面にバリデーション機能を追加<br><br>- メールアドレスの形式チェックを実装<br>- パスワードの最小文字数チェックを追加<br>- エラーメッセージの表示機能を実装 |

---

## 6. React UI仕様

### 6.1 技術スタック

| 項目 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js (App Router) | 14.x |
| 言語 | TypeScript | 5.x |
| UIコンポーネント | shadcn/ui | latest |
| スタイリング | Tailwind CSS | 3.x |
| コードエディタ | Monaco Editor | latest |
| 状態管理 | React useState / Context | - |
| HTTPクライアント | fetch API | - |
| デプロイ | Vercel | - |

### 6.2 画面構成

```
/
├── / (トップページ)
│   └── APIキー設定 + クイックスタートガイド
│
├── /agents (エージェント一覧)
│   ├── 4つのエージェントカード表示
│   └── 各エージェントの単体テスト機能
│
├── /agents/[id] (エージェント詳細)
│   ├── Agent Card表示（JSON）
│   ├── 単体リクエスト送信フォーム
│   └── レスポンス表示
│
├── /playground (コードエディタ)
│   ├── Monaco Editor（エージェント連携コード編集）
│   ├── 実行ボタン
│   ├── 実行結果表示
│   └── サンプルコードテンプレート
│
└── /learn (学習ページ)
    ├── A2Aプロトコル解説
    ├── Agent Card解説
    └── JSON-RPC解説
```

### 6.3 コンポーネント設計

#### 6.3.1 共通コンポーネント

| コンポーネント | 説明 | 使用するshadcn/ui |
|--------------|------|------------------|
| `Header` | ナビゲーションバー | NavigationMenu |
| `ApiKeyDialog` | APIキー設定モーダル | Dialog, Input, Select, Button |
| `AgentCard` | エージェント情報カード | Card, Badge |
| `ResponseViewer` | JSON/テキストレスポンス表示 | Card, ScrollArea |
| `LoadingSpinner` | ローディング表示 | - (カスタム) |
| `ErrorAlert` | エラー表示 | Alert |

#### 6.3.2 ページ固有コンポーネント

| ページ | コンポーネント | 説明 |
|-------|--------------|------|
| `/agents` | `AgentGrid` | エージェントカードのグリッド表示 |
| `/agents/[id]` | `AgentTester` | 単体テスト用フォーム |
| `/agents/[id]` | `AgentCardViewer` | Agent Card JSON表示 |
| `/playground` | `CodeEditor` | Monaco Editorラッパー |
| `/playground` | `ExecutionPanel` | 実行ボタン + 結果表示 |
| `/playground` | `TemplateSelector` | サンプルコード選択 |

### 6.4 状態管理

#### グローバル状態（Context）

```typescript
interface AppState {
  // LLM設定
  llmProvider: 'openai' | 'gemini';
  apiKey: string;
  isApiKeySet: boolean;
  
  // エージェントURL（環境変数から取得）
  agents: {
    encourager: string;
    rephraser: string;
    namer: string;
    commit: string;
  };
}
```

#### ローカル状態（各ページ）

```typescript
// /agents/[id] ページ
interface AgentTesterState {
  input: string;
  response: A2AResponse | null;
  isLoading: boolean;
  error: string | null;
}

// /playground ページ
interface PlaygroundState {
  code: string;
  executionResult: ExecutionResult[];
  isExecuting: boolean;
}
```

### 6.5 A2Aクライアント実装

UIからエージェントを呼び出すためのクライアント関数：

```typescript
// lib/a2a-client.ts

interface A2AClientConfig {
  provider: 'openai' | 'gemini';
  apiKey: string;
}

interface SendMessageParams {
  agentUrl: string;
  text: string;
}

interface A2AResponse {
  success: boolean;
  taskId?: string;
  result?: string;
  error?: {
    code: number;
    message: string;
  };
}

export async function sendMessage(
  config: A2AClientConfig,
  params: SendMessageParams
): Promise<A2AResponse> {
  const response = await fetch(params.agentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-LLM-Provider': config.provider,
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
          parts: [{ kind: 'text', text: params.text }],
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
    return {
      success: false,
      error: data.error,
    };
  }
  
  return {
    success: true,
    taskId: data.result.id,
    result: data.result.artifacts?.[0]?.parts?.[0]?.text,
  };
}

export async function fetchAgentCard(agentUrl: string) {
  const cardUrl = new URL('/.well-known/agent-card.json', agentUrl);
  const response = await fetch(cardUrl.toString());
  return response.json();
}
```

### 6.6 Playgroundのコード実行

参加者がコードエディタで書いたコードを実行する仕組み：

```typescript
// lib/playground-executor.ts

// 参加者が書くコードのテンプレート
const defaultCode = `
// エージェントにメッセージを送信する関数
// await sendToAgent(agentName, text) で呼び出せます
// agentName: 'encourager' | 'rephraser' | 'namer' | 'commit'

// 例1: 単体で呼び出し
const result = await sendToAgent('encourager', '今日は失敗ばかりだった');
console.log(result);

// 例2: 連携して呼び出し
// const step1 = await sendToAgent('encourager', '上司に怒られた');
// const step2 = await sendToAgent('rephraser', step1);
// console.log(step2);
`;

// 実行関数（安全なサンドボックス内で実行）
export async function executePlaygroundCode(
  code: string,
  config: A2AClientConfig,
  agents: Record<string, string>
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];
  
  // sendToAgent関数を注入
  const sendToAgent = async (agentName: string, text: string) => {
    const agentUrl = agents[agentName];
    if (!agentUrl) {
      throw new Error(`Unknown agent: ${agentName}`);
    }
    
    const startTime = Date.now();
    const response = await sendMessage(config, { agentUrl, text });
    const duration = Date.now() - startTime;
    
    results.push({
      agent: agentName,
      input: text,
      output: response.result,
      duration,
      success: response.success,
      error: response.error,
    });
    
    return response.result;
  };
  
  // コードを実行（AsyncFunctionを使用）
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  const fn = new AsyncFunction('sendToAgent', 'console', code);
  
  const customConsole = {
    log: (...args: any[]) => {
      results.push({
        type: 'log',
        content: args.map(a => JSON.stringify(a)).join(' '),
      });
    },
  };
  
  await fn(sendToAgent, customConsole);
  
  return results;
}
```

---

## 7. デプロイ仕様

### 7.1 Cloud Run設定（エージェント共通）

```yaml
# 各エージェントの設定
service:
  name: a2a-agent-{name}
  region: asia-northeast1
  
  scaling:
    min_instances: 1  # コールドスタート回避
    max_instances: 10
    
  resources:
    cpu: 1
    memory: 512Mi
    
  env:
    - name: PORT
      value: "8080"
      
  # 認証なし（公開エンドポイント）
  allow_unauthenticated: true
  
  # タイムアウト
  timeout: 60s
```

### 7.2 Dockerイメージ

#### Python エージェント用 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

#### TypeScript エージェント用 Dockerfile

```dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
```

### 7.3 Vercel設定（React UI）

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["hnd1"],
  "env": {
    "NEXT_PUBLIC_AGENT_ENCOURAGER_URL": "@agent-encourager-url",
    "NEXT_PUBLIC_AGENT_REPHRASER_URL": "@agent-rephraser-url",
    "NEXT_PUBLIC_AGENT_NAMER_URL": "@agent-namer-url",
    "NEXT_PUBLIC_AGENT_COMMIT_URL": "@agent-commit-url"
  }
}
```

---

## 8. ディレクトリ構成

```
a2a-handson/
├── README.md
├── docs/
│   └── requirements.md          # この要件定義書
│
├── agents/
│   ├── python/                  # Pythonエージェント（モノレポ）
│   │   ├── pyproject.toml
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── common/          # 共通モジュール
│   │   │   │   ├── __init__.py
│   │   │   │   ├── llm.py       # LLMクライアント（OpenAI/Gemini切替）
│   │   │   │   ├── a2a_handler.py  # A2Aリクエストハンドラー
│   │   │   │   └── models.py    # Pydanticモデル
│   │   │   │
│   │   │   ├── encourager/      # 励ましエージェント
│   │   │   │   ├── __init__.py
│   │   │   │   ├── main.py      # FastAPIアプリ
│   │   │   │   ├── agent.py     # エージェントロジック
│   │   │   │   └── config.py    # Agent Card定義
│   │   │   │
│   │   │   └── rephraser/       # 言い換えエージェント
│   │   │       ├── __init__.py
│   │   │       ├── main.py
│   │   │       ├── agent.py
│   │   │       └── config.py
│   │   │
│   │   └── tests/
│   │       ├── test_encourager.py
│   │       └── test_rephraser.py
│   │
│   └── typescript/              # TypeScriptエージェント（モノレポ）
│       ├── package.json
│       ├── tsconfig.json
│       ├── Dockerfile
│       ├── src/
│       │   ├── common/          # 共通モジュール
│       │   │   ├── llm.ts       # LLMクライアント
│       │   │   ├── a2a-handler.ts
│       │   │   └── types.ts
│       │   │
│       │   ├── namer/           # 命名エージェント
│       │   │   ├── index.ts     # Expressアプリ
│       │   │   ├── agent.ts
│       │   │   └── config.ts    # Agent Card定義
│       │   │
│       │   └── commit/          # コミットメッセージエージェント
│       │       ├── index.ts
│       │       ├── agent.ts
│       │       └── config.ts
│       │
│       └── tests/
│           ├── namer.test.ts
│           └── commit.test.ts
│
├── ui/                          # React UI
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── components.json          # shadcn/ui設定
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # トップページ
│   │   ├── agents/
│   │   │   ├── page.tsx         # エージェント一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx     # エージェント詳細
│   │   ├── playground/
│   │   │   └── page.tsx         # コードエディタ
│   │   └── learn/
│   │       └── page.tsx         # 学習ページ
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/uiコンポーネント
│   │   ├── header.tsx
│   │   ├── api-key-dialog.tsx
│   │   ├── agent-card.tsx
│   │   ├── agent-tester.tsx
│   │   ├── code-editor.tsx
│   │   └── response-viewer.tsx
│   │
│   ├── lib/
│   │   ├── a2a-client.ts        # A2Aクライアント
│   │   ├── playground-executor.ts
│   │   └── utils.ts
│   │
│   └── contexts/
│       └── app-context.tsx      # グローバル状態
│
├── scripts/
│   ├── deploy-agents.sh         # エージェントデプロイスクリプト
│   └── test-agents.sh           # エージェント動作確認スクリプト
│
└── .github/
    └── workflows/
        ├── deploy-agents.yml    # エージェントCI/CD
        └── deploy-ui.yml        # UI CI/CD
```

---

## 9. 実装優先順位

Claude Codeが実装する際の推奨順序：

### Phase 1: 基盤構築
1. ディレクトリ構成の作成
2. Python共通モジュール（LLMクライアント、A2Aハンドラー）
3. TypeScript共通モジュール

### Phase 2: エージェント実装
4. 励ましエージェント（Python）
5. 言い換えエージェント（Python）
6. 命名エージェント（TypeScript）
7. コミットメッセージエージェント（TypeScript）

### Phase 3: UI実装
8. Next.js + shadcn/ui セットアップ
9. APIキー設定機能
10. エージェント一覧・単体テストページ
11. Playground（コードエディタ）ページ

### Phase 4: デプロイ・テスト
12. Dockerファイル作成
13. Cloud Runデプロイ設定
14. Vercelデプロイ設定
15. E2Eテスト

---

## 10. 補足事項

### 10.1 セキュリティ考慮

- 参加者のAPIキーはブラウザのlocalStorageに保存（セッション限定でも可）
- APIキーはサーバーに保存しない（リクエスト時にヘッダーで送信）
- Cloud Runは認証なしで公開するが、レート制限を検討
- CORSは `*` を許可（ハンズオン用途のため）

### 10.2 エラーハンドリング

- APIキー未設定時：設定ダイアログを表示
- 無効なAPIキー：エラーメッセージを表示
- ネットワークエラー：リトライオプションを提供
- LLM API制限：制限に関するメッセージを表示

### 10.3 ハンズオン当日の運用

- 参加者に配布するもの：
  - UIのURL
  - GitHubリポジトリのURL（参照用）
  - APIキー取得方法のガイド
- 事前に確認すること：
  - 全エージェントの動作確認
  - Cloud Runのコールドスタート回避（min_instances=1）
  - Vercelのデプロイ状態

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-11-29 | 1.0.0 | 初版作成 |

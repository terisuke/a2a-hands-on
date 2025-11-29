# A2A Handson

A2A (Agent-to-Agent) Protocol 入門ハンズオン用のシステムです。

## 概要

このプロジェクトは、女性エンジニア向け技術コミュニティ「WAKE Career」主催のA2Aプロトコル入門ハンズオンで使用するシステムです。

### ハンズオンのゴール

- A2Aプロトコルの仕組み・役割をざっくり理解し、実務での活用イメージを持ち帰れる
- AIエージェントを「単体で使う」から「連携させて使う」段階へステップアップできる
- 異なる言語（Python/TypeScript）で作られたエージェントがA2Aで連携できることを体感する

## システム構成

```
┌─────────────────────────────────────────────────────────────────┐
│                      参加者のブラウザ                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  React UI (Vercel)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ A2A Protocol (JSON-RPC 2.0 over HTTPS)
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
```

## エージェント一覧

| エージェント | 言語 | ポート | 説明 |
|------------|------|--------|------|
| 励ましエージェント | Python | 8080 | 悩みに共感し、温かい励ましを返す |
| 言い換えエージェント | Python | 8081 | 攻撃的な表現をマイルドに変換 |
| 翻訳エージェント | Python | 8084 | 日本語テキストを英語に翻訳 |
| 要約エージェント | Python | 8085 | 長いテキストを簡潔に要約 |
| 命名エージェント | TypeScript | 8082 | 変数名・関数名の候補を提案 |
| コミットメッセージエージェント | TypeScript | 8083 | Gitコミットメッセージを生成 |
| レビューエージェント | TypeScript | 8086 | コードに対して建設的なレビューを提供 |
| ドキュメントエージェント | TypeScript | 8087 | 技術ドキュメントを生成 |

## プロジェクト構成

```
a2a-handson/
├── agents/
│   ├── python/              # Pythonエージェント
│   │   ├── src/
│   │   │   ├── common/      # 共通モジュール
│   │   │   ├── encourager/  # 励ましエージェント
│   │   │   ├── rephraser/   # 言い換えエージェント
│   │   │   ├── translator/  # 翻訳エージェント
│   │   │   └── summarizer/  # 要約エージェント
│   │   └── Dockerfile.*
│   │
│   └── typescript/          # TypeScriptエージェント
│       ├── src/
│       │   ├── common/      # 共通モジュール
│       │   ├── namer/       # 命名エージェント
│       │   ├── commit/      # コミットメッセージエージェント
│       │   ├── reviewer/    # レビューエージェント
│       │   └── documenter/  # ドキュメントエージェント
│       └── Dockerfile.*
│
├── ui/                      # React UI (Next.js)
│   ├── app/
│   ├── components/
│   └── lib/
│
├── scripts/                 # デプロイ・テストスクリプト
└── .github/workflows/       # CI/CD
```

## ローカル開発

### 必要な環境

- Python 3.11+
- Node.js 20+
- npm or yarn

### Pythonエージェントの起動

```bash
cd agents/python
pip install -r requirements.txt

# 励ましエージェント (port 8080)
PYTHONPATH=. uvicorn src.encourager.main:app --port 8080

# 言い換えエージェント (port 8081)
PYTHONPATH=. uvicorn src.rephraser.main:app --port 8081

# 翻訳エージェント (port 8084)
PYTHONPATH=. uvicorn src.translator.main:app --port 8084

# 要約エージェント (port 8085)
PYTHONPATH=. uvicorn src.summarizer.main:app --port 8085
```

### TypeScriptエージェントの起動

```bash
cd agents/typescript
npm install

# 命名エージェント (port 8082)
npm run dev:namer

# コミットメッセージエージェント (port 8083)
npm run dev:commit

# レビューエージェント (port 8086)
npm run dev:reviewer

# ドキュメントエージェント (port 8087)
npm run dev:documenter
```

### UIの起動

```bash
cd ui
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## エージェントのテスト

```bash
# エージェントカードの取得
curl http://localhost:8080/.well-known/agent-card.json

# メッセージ送信
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
        "parts": [{"kind": "text", "text": "今日のコードレビュー、厳しい指摘をもらった"}]
      },
      "configuration": {
        "acceptedOutputModes": ["text/plain"],
        "blocking": true
      }
    }
  }'
```

## デプロイ

### Cloud Runへのデプロイ

```bash
./scripts/deploy-agents.sh your-gcp-project asia-northeast1
```

### Vercelへのデプロイ

UIはVercelに自動デプロイされます。環境変数にエージェントのURLを設定してください。

## A2Aプロトコルについて

A2A (Agent-to-Agent) プロトコルは、異なるAIエージェント同士が標準化された方法で通信するためのオープンプロトコルです。

### 主な概念

- **Agent Card**: エージェントの情報を公開するJSON形式の仕様
- **JSON-RPC 2.0**: 通信プロトコル
- **Skills**: エージェントが提供する機能

詳細は [A2A Protocol Specification](https://google.github.io/A2A/) を参照してください。

## ライセンス

MIT

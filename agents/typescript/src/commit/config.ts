/**
 * Commit Message Agent Configuration
 */

import type { AgentCard } from '../common/types.js';

export const SYSTEM_PROMPT = `あなたはGitのコミットメッセージを作成する専門家です。
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

日本語で、簡潔かつ明確なメッセージを返してください。`;

export function getAgentCard(): AgentCard {
  const baseUrl = process.env.AGENT_BASE_URL || 'http://localhost:8083';

  return {
    protocolVersion: '0.3.0',
    name: 'コミットメッセージエージェント',
    description:
      '変更内容の説明から、Conventional Commits形式のGitコミットメッセージを生成します。「fix」「update」で済ませがちな人におすすめ。',
    url: baseUrl,
    preferredTransport: 'JSONRPC',
    provider: {
      organization: 'A2A Handson',
      url: 'https://github.com/a2a-handson',
    },
    version: '1.0.0',
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain'],
    skills: [
      {
        id: 'commit-message',
        name: 'コミットメッセージ生成',
        description:
          '変更内容からConventional Commits形式のコミットメッセージを生成します',
        tags: ['git', 'commit', 'developer-tools', 'version-control'],
        examples: [
          'ログイン画面のバリデーションを追加した',
          'パフォーマンス改善のためにキャッシュを導入',
          'READMEにインストール手順を追記',
        ],
        inputModes: ['text/plain'],
        outputModes: ['text/plain'],
      },
    ],
  };
}

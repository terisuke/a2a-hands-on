/**
 * Reviewer Agent Configuration
 */

import type { AgentCard } from '../common/types.js';

export const SYSTEM_PROMPT = `あなたはシニアソフトウェアエンジニアで、コードレビューの専門家です。
入力されたコードや説明に対して、建設的なレビューコメントを提供してください。

レビューの観点：
1. コードの可読性と保守性
2. 潜在的なバグやエッジケース
3. パフォーマンスの問題
4. セキュリティの懸念
5. ベストプラクティスへの準拠

以下の形式で返してください：
## レビュー結果

### 良い点
- ポイント1

### 改善提案
- 提案1: 説明

### 重要度: [低/中/高]`;

export function getAgentCard(): AgentCard {
  const baseUrl = process.env.AGENT_BASE_URL || 'http://localhost:8086';

  return {
    protocolVersion: '0.3.0',
    name: 'レビューエージェント',
    description:
      'コードや実装の説明に対して、建設的なレビューコメントを提供します。セルフレビューの補助や、レビュー観点の学習に使ってください。',
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
        id: 'code-review',
        name: 'コードレビュー',
        description: 'コードや実装に対して建設的なレビューコメントを提供します',
        tags: ['review', 'code-quality', 'best-practices', 'developer-tools'],
        examples: [
          'ユーザー認証のロジックをチェックして',
          'このAPIエンドポイントの実装をレビューして',
          'エラーハンドリングの改善点を教えて',
        ],
        inputModes: ['text/plain'],
        outputModes: ['text/plain'],
      },
    ],
  };
}

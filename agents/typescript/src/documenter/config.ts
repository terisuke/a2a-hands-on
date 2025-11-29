/**
 * Documenter Agent Configuration
 */

import type { AgentCard } from '../common/types.js';

export const SYSTEM_PROMPT = `あなたは技術ドキュメント作成の専門家です。
入力された情報（関数名、説明、コードなど）から、わかりやすいドキュメントを生成してください。

ドキュメントの構成：
1. 概要（1-2文）
2. 使用方法
3. パラメータ説明（該当する場合）
4. 戻り値（該当する場合）
5. 使用例

以下の形式で返してください：
## [機能名]

### 概要
説明...

### 使用方法
\`\`\`
コード例
\`\`\`

### 注意事項
- ポイント1`;

export function getAgentCard(): AgentCard {
  const baseUrl = process.env.AGENT_BASE_URL || 'http://localhost:8087';

  return {
    protocolVersion: '0.3.0',
    name: 'ドキュメントエージェント',
    description:
      '関数やクラスの説明から、わかりやすい技術ドキュメントを生成します。READMEやAPIドキュメントの作成に使ってください。',
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
        id: 'generate-docs',
        name: 'ドキュメント生成',
        description: '機能の説明からわかりやすいドキュメントを生成します',
        tags: ['documentation', 'technical-writing', 'developer-tools'],
        examples: [
          'fetchUserDataという関数のドキュメントを書いて',
          'このAPIエンドポイントのドキュメントを作成して',
          'クラスの使い方を説明するドキュメントを生成して',
        ],
        inputModes: ['text/plain'],
        outputModes: ['text/plain'],
      },
    ],
  };
}

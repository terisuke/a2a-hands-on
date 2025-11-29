/**
 * Namer Agent Configuration
 */

import type { AgentCard } from '../common/types.js';

export const SYSTEM_PROMPT = `あなたはプログラミングの命名規則に精通したエンジニアです。
ユーザーが説明した機能に対して、適切な名前の候補を4〜6個提案してください。

ルール：
1. camelCase と snake_case の両方で提案
2. 英語で、意味が明確に伝わる名前
3. 短すぎず長すぎない（2〜4単語程度）
4. 一般的なコーディング規約に沿った名前

以下の形式で返してください：
## 関数名/変数名の候補

1. \`candidateName1\` - 簡単な説明
2. \`candidate_name_2\` - 簡単な説明
...`;

export function getAgentCard(): AgentCard {
  const baseUrl = process.env.AGENT_BASE_URL || 'http://localhost:8082';

  return {
    protocolVersion: '0.3.0',
    name: '命名エージェント',
    description:
      '機能の説明から、適切な変数名・関数名・クラス名の候補を提案します。命名で30分悩む問題を解決します。',
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
        id: 'naming',
        name: '命名提案',
        description: '機能の説明から変数名・関数名の候補を4〜6個提案します',
        tags: ['naming', 'coding', 'developer-tools', 'programming'],
        examples: [
          'ユーザーのメールアドレスを検証する関数',
          '商品の合計金額を計算する',
          'ログイン状態を保持する変数',
        ],
        inputModes: ['text/plain'],
        outputModes: ['text/plain'],
      },
    ],
  };
}

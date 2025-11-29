/**
 * Playground Code Executor
 */

import { sendMessage, A2AClientConfig } from "./a2a-client";

export interface ExecutionResult {
  type: "agent" | "log" | "error";
  agent?: string;
  language?: string;
  input?: string;
  output?: string;
  duration?: number;
  success?: boolean;
  error?: unknown;
  content?: string;
}

// エージェントの言語情報
const agentLanguages: Record<string, string> = {
  // Python
  encourager: "Python",
  rephraser: "Python",
  translator: "Python",
  summarizer: "Python",
  // TypeScript
  namer: "TypeScript",
  commit: "TypeScript",
  reviewer: "TypeScript",
  documenter: "TypeScript",
};

export const defaultCode = `// A2Aプロトコルでエージェントを連携させよう！
//
// 【Python製エージェント】
//   encourager (励まし), rephraser (言い換え)
//   translator (日英翻訳), summarizer (要約)
//
// 【TypeScript製エージェント】
//   namer (命名), commit (コミットメッセージ)
//   reviewer (コードレビュー), documenter (ドキュメント生成)
//
// await sendToAgent(agentName, text) で呼び出せます

// まずは単体で試してみよう
const result = await sendToAgent('namer', 'ユーザーのログイン状態を管理するクラス');
console.log('命名エージェント(TypeScript)の提案:', result);
`;

export const sampleTemplates = [
  {
    name: "国際化対応パイプライン",
    description: "日本語→翻訳→命名→ドキュメント（実データ連携）",
    code: `// 【国際化対応パイプライン】
// 日本語の機能説明から、英語の命名とドキュメントを生成する
//
// ★ A2Aの真価: 各ステップの出力が次のステップの入力になる
//
// フロー: translator(Py) → namer(TS) → documenter(TS)

console.log("=== 国際化対応パイプライン ===\\n");

// 入力: 日本語の機能説明
const japaneseDescription = "ユーザーがカートに入れた商品の合計金額を、割引クーポンを適用して計算する";
console.log("【入力】日本語の機能説明:");
console.log(japaneseDescription);

// Step 1: [Python] 日本語 → 英語に翻訳
console.log("\\n--- Step 1: 翻訳エージェント(Python) ---");
const englishDescription = await sendToAgent('translator', japaneseDescription);
console.log("英訳結果:", englishDescription);

// Step 2: [TypeScript] 英語の説明から命名提案
console.log("\\n--- Step 2: 命名エージェント(TypeScript) ---");
const namingSuggestion = await sendToAgent('namer', englishDescription);
console.log("命名提案:", namingSuggestion);

// Step 3: [TypeScript] 命名を含めたドキュメント生成
console.log("\\n--- Step 3: ドキュメントエージェント(TypeScript) ---");
const documentation = await sendToAgent('documenter',
  "Function: " + englishDescription + "\\n\\nSuggested names: " + namingSuggestion.slice(0, 200)
);
console.log("生成されたドキュメント:", documentation);

console.log("\\n=== パイプライン完了！ ===");
console.log("\\n★ 注目: 日本語の説明が、翻訳→命名→ドキュメントと変換されました");`,
  },
  {
    name: "コードレビュー改善フロー",
    description: "レビュー→言い換え→励まし→コミット（実データ連携）",
    code: `// 【コードレビュー改善フロー】
// 厳しいレビューを受けた後の改善プロセス
//
// ★ A2Aの真価: 各エージェントが前のエージェントの出力を処理する
//
// フロー: reviewer(TS) → rephraser(Py) → encourager(Py) → commit(TS)

console.log("=== コードレビュー改善フロー ===\\n");

// 入力: レビュー対象のコード説明
const codeDescription = "try-catchなしでAPIを呼び出し、nullチェックもせずにデータを表示している";
console.log("【入力】レビュー対象のコード:");
console.log(codeDescription);

// Step 1: [TypeScript] コードレビューを実施
console.log("\\n--- Step 1: レビューエージェント(TypeScript) ---");
const reviewResult = await sendToAgent('reviewer', codeDescription);
console.log("レビュー結果:", reviewResult);

// Step 2: [Python] レビューコメントを建設的な表現に言い換え
console.log("\\n--- Step 2: 言い換えエージェント(Python) ---");
const gentleReview = await sendToAgent('rephraser',
  "以下のレビューコメントを、もっと優しく建設的に言い換えて: " + reviewResult.slice(0, 300)
);
console.log("言い換え後:", gentleReview);

// Step 3: [Python] レビューを受けた開発者を励ます
console.log("\\n--- Step 3: 励ましエージェント(Python) ---");
const encouragement = await sendToAgent('encourager',
  "コードレビューで指摘を受けました: " + gentleReview.slice(0, 200)
);
console.log("励ましメッセージ:", encouragement);

// Step 4: [TypeScript] 修正内容のコミットメッセージを生成
console.log("\\n--- Step 4: コミットエージェント(TypeScript) ---");
const commitMessage = await sendToAgent('commit',
  "レビュー指摘を受けて修正: " + gentleReview.slice(0, 150)
);
console.log("コミットメッセージ:", commitMessage);

console.log("\\n=== フロー完了！ ===");
console.log("\\n★ 注目: レビュー結果が言い換え→励まし→コミットと処理されました");`,
  },
  {
    name: "ドキュメント要約パイプライン",
    description: "ドキュメント生成→要約→翻訳（実データ連携）",
    code: `// 【ドキュメント要約パイプライン】
// 詳細なドキュメントを生成し、要約して、英語に翻訳する
//
// ★ A2Aの真価: 長いドキュメントが処理されながら変換される
//
// フロー: documenter(TS) → summarizer(Py) → translator(Py)

console.log("=== ドキュメント要約パイプライン ===\\n");

// 入力: 機能の説明
const featureDescription = "ユーザー認証システム - JWTトークンを使用したログイン、リフレッシュトークン、ログアウト機能";
console.log("【入力】機能説明:");
console.log(featureDescription);

// Step 1: [TypeScript] 詳細なドキュメントを生成
console.log("\\n--- Step 1: ドキュメントエージェント(TypeScript) ---");
const fullDoc = await sendToAgent('documenter', featureDescription);
console.log("生成されたドキュメント:");
console.log(fullDoc);

// Step 2: [Python] ドキュメントを要約
console.log("\\n--- Step 2: 要約エージェント(Python) ---");
const summary = await sendToAgent('summarizer', fullDoc);
console.log("要約結果:");
console.log(summary);

// Step 3: [Python] 要約を英語に翻訳
console.log("\\n--- Step 3: 翻訳エージェント(Python) ---");
const englishSummary = await sendToAgent('translator', summary);
console.log("英語版要約:");
console.log(englishSummary);

console.log("\\n=== パイプライン完了！ ===");
console.log("\\n★ 注目: 詳細ドキュメント→要約→英訳と情報が圧縮・変換されました");`,
  },
  {
    name: "8エージェント全連携",
    description: "全エージェントを順次呼び出し（実データ連携）",
    code: `// 【8エージェント全連携パイプライン】
// すべてのエージェントを通してデータを処理する
//
// ★ A2Aの真価: Python↔TypeScriptを交互に、データが流れる
//
// フロー: translator(Py) → namer(TS) → reviewer(TS) → rephraser(Py)
//       → summarizer(Py) → documenter(TS) → encourager(Py) → commit(TS)

console.log("=== 8エージェント全連携パイプライン ===\\n");

// 入力
const input = "データベースからユーザー情報を取得して、キャッシュに保存する処理";
console.log("【入力】", input);

// Step 1: [Python] 翻訳
console.log("\\n[1/8] translator(Py)");
const step1 = await sendToAgent('translator', input);
console.log("→", step1.slice(0, 100));

// Step 2: [TypeScript] 命名
console.log("\\n[2/8] namer(TS)");
const step2 = await sendToAgent('namer', step1);
console.log("→", step2.slice(0, 150));

// Step 3: [TypeScript] レビュー
console.log("\\n[3/8] reviewer(TS)");
const step3 = await sendToAgent('reviewer',
  "実装予定: " + step1 + " 命名案: " + step2.slice(0, 100)
);
console.log("→", step3.slice(0, 200));

// Step 4: [Python] 言い換え
console.log("\\n[4/8] rephraser(Py)");
const step4 = await sendToAgent('rephraser', step3.slice(0, 300));
console.log("→", step4.slice(0, 150));

// Step 5: [Python] 要約
console.log("\\n[5/8] summarizer(Py)");
const step5 = await sendToAgent('summarizer',
  "機能: " + step1 + " レビュー: " + step4
);
console.log("→", step5.slice(0, 150));

// Step 6: [TypeScript] ドキュメント
console.log("\\n[6/8] documenter(TS)");
const step6 = await sendToAgent('documenter',
  step5 + " 推奨命名: " + step2.slice(0, 80)
);
console.log("→", step6.slice(0, 200));

// Step 7: [Python] 励まし
console.log("\\n[7/8] encourager(Py)");
const step7 = await sendToAgent('encourager',
  "複雑な機能の実装とドキュメント作成を完了しました: " + step5.slice(0, 100)
);
console.log("→", step7.slice(0, 150));

// Step 8: [TypeScript] コミット
console.log("\\n[8/8] commit(TS)");
const step8 = await sendToAgent('commit', step5);
console.log("→", step8);

console.log("\\n=== 全8エージェント連携完了！ ===");`,
  },
  {
    name: "並列処理 + 統合",
    description: "並列で複数処理→結果を統合（実データ連携）",
    code: `// 【並列処理 + 統合パターン】
// 複数の処理を並列実行し、結果を統合する
//
// ★ A2Aの真価: 独立した処理を並列化し、統合エージェントでまとめる
//
// フロー: [translator + reviewer](並列) → summarizer → commit

console.log("=== 並列処理 + 統合パターン ===\\n");

// 入力
const codeTask = "ログイン失敗時にエラーメッセージを表示し、3回失敗でアカウントをロックする";
console.log("【入力】", codeTask);

// Phase 1: 並列処理
console.log("\\n--- Phase 1: 並列処理 (Python + TypeScript) ---");
console.log("翻訳とレビューを同時実行中...");

const [translated, reviewed] = await Promise.all([
  sendToAgent('translator', codeTask),
  sendToAgent('reviewer', codeTask)
]);

console.log("\\n[Python] 翻訳結果:");
console.log(translated);
console.log("\\n[TypeScript] レビュー結果:");
console.log(reviewed.slice(0, 300));

// Phase 2: 統合 - 両方の結果を要約
console.log("\\n--- Phase 2: 統合処理 (Python) ---");
const integrated = await sendToAgent('summarizer',
  "英語での機能説明: " + translated + "\\n\\nレビューコメント: " + reviewed.slice(0, 300)
);
console.log("統合・要約結果:");
console.log(integrated);

// Phase 3: 最終出力
console.log("\\n--- Phase 3: 最終出力 (TypeScript) ---");
const finalCommit = await sendToAgent('commit', integrated);
console.log("コミットメッセージ:");
console.log(finalCommit);

console.log("\\n=== 並列処理 + 統合 完了！ ===");
console.log("\\n★ 注目: 翻訳とレビューを並列実行→要約で統合→コミットメッセージ生成");`,
  },
  {
    name: "単体テスト（全8エージェント）",
    description: "8つのエージェントを個別にテスト",
    code: `// 【単体テスト】全8エージェントを個別に呼び出し

console.log("=== 全8エージェント単体テスト ===\\n");

// Python製エージェント (4つ)
console.log("--- Python製エージェント ---\\n");

const enc = await sendToAgent('encourager', 'プログラミングを始めて1年、まだまだ分からないことだらけ');
console.log("[励まし]", enc);

const rep = await sendToAgent('rephraser', 'このコード、何やってるか全然分からない');
console.log("\\n[言い換え]", rep);

const tra = await sendToAgent('translator', 'ユーザーの入力を検証する関数');
console.log("\\n[翻訳]", tra);

const sum = await sendToAgent('summarizer', 'このシステムは、ユーザーがログインすると、データベースから過去の購買履歴を取得し、おすすめ商品を表示します。また、カートに入れた商品の合計金額を計算し、クーポンを適用することもできます。');
console.log("\\n[要約]", sum);

// TypeScript製エージェント (4つ)
console.log("\\n--- TypeScript製エージェント ---\\n");

const nam = await sendToAgent('namer', 'パスワードをハッシュ化する関数');
console.log("[命名]", nam);

const com = await sendToAgent('commit', 'セキュリティ強化のためパスワードハッシュ化を実装');
console.log("\\n[コミット]", com);

const rev = await sendToAgent('reviewer', 'try-catchなしでAPIを呼び出している');
console.log("\\n[レビュー]", rev);

const doc = await sendToAgent('documenter', 'validateEmail - メールアドレスの形式をチェックする関数');
console.log("\\n[ドキュメント]", doc);

console.log("\\n=== 全8エージェントのテスト完了！ ===");`,
  },
];

export async function executePlaygroundCode(
  code: string,
  config: A2AClientConfig,
  agents: Record<string, string>
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];

  const sendToAgent = async (
    agentName: string,
    text: string
  ): Promise<string> => {
    const agentUrl = agents[agentName];
    if (!agentUrl) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const startTime = Date.now();
    const response = await sendMessage(config, { agentUrl, text });
    const duration = Date.now() - startTime;

    results.push({
      type: "agent",
      agent: agentName,
      language: agentLanguages[agentName] || "Unknown",
      input: text,
      output: response.result,
      duration,
      success: response.success,
      error: response.error,
    });

    if (!response.success) {
      throw new Error(
        response.error?.message || "Agent request failed"
      );
    }

    return response.result || "";
  };

  const customConsole = {
    log: (...args: unknown[]) => {
      results.push({
        type: "log",
        content: args
          .map((a) =>
            typeof a === "string" ? a : JSON.stringify(a, null, 2)
          )
          .join(" "),
      });
    },
    error: (...args: unknown[]) => {
      results.push({
        type: "error",
        content: args
          .map((a) =>
            typeof a === "string" ? a : JSON.stringify(a, null, 2)
          )
          .join(" "),
      });
    },
  };

  try {
    const AsyncFunction = Object.getPrototypeOf(
      async function () {}
    ).constructor;
    const fn = new AsyncFunction(
      "sendToAgent",
      "console",
      "Promise",
      code
    );
    await fn(sendToAgent, customConsole, Promise);
  } catch (error) {
    results.push({
      type: "error",
      content: error instanceof Error ? error.message : "Execution error",
    });
  }

  return results;
}

"use client";

import { CodeEditor } from "@/components/code-editor";
import { Badge } from "@/components/ui/badge";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground mt-2">
          A2Aプロトコルの真価を体験しましょう。
          <strong>Python と TypeScript で実装された8つのエージェント</strong>が
          シームレスにデータを受け渡しながら連携する様子を確認できます。
        </p>
      </div>

      <CodeEditor />

      <div className="bg-muted rounded-lg p-6">
        <h2 className="font-semibold mb-4">利用可能な8エージェント</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Badge className="bg-yellow-600">Python</Badge>
              Python製エージェント（4つ）
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-yellow-100 px-1 rounded">encourager</code>
                <span>悩みに共感し、温かい励ましを返す</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-yellow-100 px-1 rounded">rephraser</code>
                <span>攻撃的な表現をマイルドに変換</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-yellow-100 px-1 rounded">translator</code>
                <span>日本語を英語に翻訳</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-yellow-100 px-1 rounded">summarizer</code>
                <span>長いテキストを簡潔に要約</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Badge className="bg-blue-600">TypeScript</Badge>
              TypeScript製エージェント（4つ）
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-blue-100 px-1 rounded">namer</code>
                <span>変数名・関数名の候補を提案</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-blue-100 px-1 rounded">commit</code>
                <span>Gitコミットメッセージを生成</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-blue-100 px-1 rounded">reviewer</code>
                <span>コードの問題点をレビュー</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-foreground bg-blue-100 px-1 rounded">documenter</code>
                <span>技術ドキュメントを生成</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-3">A2Aの真価: 実データが流れる連携パイプライン</h3>
          <p className="text-sm text-muted-foreground mb-4">
            各エージェントの出力が次のエージェントの入力になり、データが変換されていきます。
          </p>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="bg-background p-3 rounded">
              <div className="font-medium mb-1">国際化対応パイプライン</div>
              <code className="text-xs text-muted-foreground">
                translator(Py) → namer(TS) → documenter(TS)
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                日本語説明 → 英訳 → 命名提案 → ドキュメント生成
              </p>
            </div>
            <div className="bg-background p-3 rounded">
              <div className="font-medium mb-1">コードレビュー改善フロー</div>
              <code className="text-xs text-muted-foreground">
                reviewer(TS) → rephraser(Py) → encourager(Py) → commit(TS)
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                レビュー → 言い換え → 励まし → コミットメッセージ
              </p>
            </div>
            <div className="bg-background p-3 rounded">
              <div className="font-medium mb-1">ドキュメント要約パイプライン</div>
              <code className="text-xs text-muted-foreground">
                documenter(TS) → summarizer(Py) → translator(Py)
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                ドキュメント生成 → 要約 → 英訳
              </p>
            </div>
            <div className="bg-background p-3 rounded">
              <div className="font-medium mb-1">8エージェント全連携</div>
              <code className="text-xs text-muted-foreground">
                Py → TS → TS → Py → Py → TS → Py → TS
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                全エージェントを通してデータを処理
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            <strong>ポイント:</strong> 従来のAPIでは、異なる言語で実装されたサービス間の連携には
            複雑な統合作業が必要でした。A2Aプロトコルでは、エージェントがどの言語で実装されているかを
            意識せずに、統一されたインターフェースで連携できます。
          </p>
        </div>
      </div>
    </div>
  );
}

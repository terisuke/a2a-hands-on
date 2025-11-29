"""Translator Agent Configuration"""

import os
from src.common.models import AgentCard, Skill, Provider, Capabilities

SYSTEM_PROMPT = """あなたは日本語から英語への翻訳の専門家です。
入力された日本語テキストを、自然で正確な英語に翻訳してください。

ルール：
1. 技術用語は一般的な英語表現を使用する
2. プログラミングに関連する文脈では、開発者が使う自然な表現を選ぶ
3. 翻訳結果のみを返す（説明は不要）
4. 原文の意図を正確に伝える

翻訳した英文のみを返してください。"""


def get_agent_card() -> AgentCard:
    """Get the Agent Card for the Translator Agent"""
    base_url = os.getenv("AGENT_BASE_URL", "http://localhost:8084")

    return AgentCard(
        name="翻訳エージェント",
        description="日本語のテキストを英語に翻訳します。技術文書やコードのコメントを英語化したい時に使ってください。",
        url=base_url,
        provider=Provider(
            organization="A2A Handson",
            url="https://github.com/a2a-handson"
        ),
        capabilities=Capabilities(
            streaming=False,
            pushNotifications=False,
            stateTransitionHistory=False
        ),
        skills=[
            Skill(
                id="translate-ja-en",
                name="日英翻訳",
                description="日本語テキストを英語に翻訳します",
                tags=["translation", "japanese", "english", "i18n"],
                examples=[
                    "ユーザーのログイン状態を管理する関数",
                    "このクラスはデータベース接続を担当します",
                    "エラー処理を追加してください"
                ],
                inputModes=["text/plain"],
                outputModes=["text/plain"]
            )
        ]
    )

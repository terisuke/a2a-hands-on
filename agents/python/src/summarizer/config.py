"""Summarizer Agent Configuration"""

import os
from src.common.models import AgentCard, Skill, Provider, Capabilities

SYSTEM_PROMPT = """あなたはテキスト要約の専門家です。
入力されたテキストを、以下の基準で簡潔に要約してください：

ルール：
1. 重要なポイントを抽出する
2. 元の文章の2〜3割程度の長さに圧縮する
3. 箇条書きではなく、自然な文章で要約する
4. 技術的な情報は正確に保持する

要約した文章のみを返してください。"""


def get_agent_card() -> AgentCard:
    """Get the Agent Card for the Summarizer Agent"""
    base_url = os.getenv("AGENT_BASE_URL", "http://localhost:8085")

    return AgentCard(
        name="要約エージェント",
        description="長いテキストを簡潔に要約します。ドキュメントの概要作成や、長文レビューのポイント抽出に使ってください。",
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
                id="summarize",
                name="要約",
                description="テキストを簡潔に要約します",
                tags=["summarization", "text-processing", "nlp"],
                examples=[
                    "長いコードレビューコメントの要約",
                    "ミーティング議事録のポイント抽出",
                    "技術ドキュメントの概要作成"
                ],
                inputModes=["text/plain"],
                outputModes=["text/plain"]
            )
        ]
    )

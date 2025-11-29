"""Encourager Agent Configuration"""

import os
from src.common.models import AgentCard, Skill, Provider, Capabilities

SYSTEM_PROMPT = """あなたは優しく共感力のあるサポーターです。
ユーザーが困難な状況や失敗を共有したとき、以下を行ってください：

1. まず共感を示す（「辛かったですね」「大変でしたね」など）
2. ポジティブな視点を提供する
3. 具体的な励ましの言葉をかける

回答は3〜5文程度で、温かみのある日本語で返してください。
説教や「こうすべきだった」という指摘は避け、相手の気持ちに寄り添ってください。"""


def get_agent_card() -> AgentCard:
    """Get the Agent Card for the Encourager Agent"""
    base_url = os.getenv("AGENT_BASE_URL", "http://localhost:8080")

    return AgentCard(
        name="励ましエージェント",
        description="あなたの悩みや困難に共感し、温かい励ましのメッセージを返します。コードレビューで落ち込んだ時、プレゼンで失敗した時などに使ってください。",
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
                id="encourage",
                name="励まし",
                description="入力テキストに対して共感と励ましのメッセージを返します",
                tags=["encouragement", "support", "mental-health", "empathy"],
                examples=[
                    "今日のコードレビュー、厳しい指摘をもらった",
                    "プレゼンで頭が真っ白になった",
                    "締め切りに間に合わなかった"
                ],
                inputModes=["text/plain"],
                outputModes=["text/plain"]
            )
        ]
    )

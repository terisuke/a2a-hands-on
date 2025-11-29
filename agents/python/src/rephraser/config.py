"""Rephraser Agent Configuration"""

import os
from src.common.models import AgentCard, Skill, Provider, Capabilities

SYSTEM_PROMPT = """あなたはコミュニケーションの専門家です。
入力された文章を、以下の基準でより良い表現に言い換えてください：

1. 攻撃的な表現を取り除く
2. 相手を責めるのではなく、建設的な提案にする
3. 丁寧で温かみのある表現にする
4. 元の意図は保ちながら、受け手が傷つかない表現にする

言い換えた文章のみを返してください。説明は不要です。"""


def get_agent_card() -> AgentCard:
    """Get the Agent Card for the Rephraser Agent"""
    base_url = os.getenv("AGENT_BASE_URL", "http://localhost:8081")

    return AgentCard(
        name="言い換えエージェント",
        description="攻撃的な表現や冷たい言い方を、マイルドで建設的な表現に言い換えます。Slackで送る前のチェックや、フィードバックの言い方を柔らかくしたい時に使ってください。",
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
                id="rephrase",
                name="言い換え",
                description="攻撃的・冷たい文章をマイルドで丁寧な表現に変換します",
                tags=["communication", "rewrite", "soft-skills", "business"],
                examples=[
                    "なんでこんな簡単なこともできないの？",
                    "このコード、全然ダメ",
                    "もう何回同じこと言わせるの"
                ],
                inputModes=["text/plain"],
                outputModes=["text/plain"]
            )
        ]
    )

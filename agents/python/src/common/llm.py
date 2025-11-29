"""LLM Client for OpenAI and Google Gemini"""

from typing import Literal

import google.generativeai as genai
from openai import OpenAI


class LLMClient:
    """Multi-provider LLM Client supporting OpenAI and Google Gemini"""

    def __init__(self, provider: Literal["openai", "gemini"], api_key: str):
        self.provider = provider
        self.api_key = api_key

        if provider == "openai":
            self.client = OpenAI(api_key=api_key)
        elif provider == "gemini":
            genai.configure(api_key=api_key)
            self.client = genai.GenerativeModel("gemini-2.5-flash")
        else:
            raise ValueError(f"Unsupported provider: {provider}")

    async def generate(self, system_prompt: str, user_message: str) -> str:
        """Generate a response from the LLM"""
        if self.provider == "openai":
            return await self._generate_openai(system_prompt, user_message)
        else:
            return await self._generate_gemini(system_prompt, user_message)

    async def _generate_openai(self, system_prompt: str, user_message: str) -> str:
        """Generate using OpenAI Responses API (GPT-5.1)"""
        response = self.client.responses.create(
            model="gpt-5.1",
            instructions=system_prompt,
            input=[
                {"role": "user", "content": user_message}
            ],
            max_output_tokens=1000,
            temperature=0.7,
        )
        return response.output_text or ""

    async def _generate_gemini(self, system_prompt: str, user_message: str) -> str:
        """Generate using Google Gemini API"""
        combined_prompt = f"{system_prompt}\n\n---\n\nUser: {user_message}"
        response = self.client.generate_content(combined_prompt)
        return response.text or ""

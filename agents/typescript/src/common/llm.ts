/**
 * LLM Client for OpenAI and Google Gemini
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider } from './types.js';

export class LLMClient {
  private provider: LLMProvider;
  private apiKey: string;
  private openaiClient?: OpenAI;
  private geminiClient?: GoogleGenerativeAI;

  constructor(provider: LLMProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;

    if (provider === 'openai') {
      this.openaiClient = new OpenAI({ apiKey });
    } else if (provider === 'gemini') {
      this.geminiClient = new GoogleGenerativeAI(apiKey);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  async generate(systemPrompt: string, userMessage: string): Promise<string> {
    if (this.provider === 'openai') {
      return this.generateOpenAI(systemPrompt, userMessage);
    } else {
      return this.generateGemini(systemPrompt, userMessage);
    }
  }

  private async generateOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    // GPT-5.1 uses the new Responses API
    const response = await this.openaiClient.responses.create({
      model: 'gpt-5.1',
      instructions: systemPrompt,
      input: [
        { role: 'user', content: userMessage },
      ],
      max_output_tokens: 1000,
      temperature: 0.7,
    });

    return response.output_text || '';
  }

  private async generateGemini(systemPrompt: string, userMessage: string): Promise<string> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const combinedPrompt = `${systemPrompt}\n\n---\n\nUser: ${userMessage}`;
    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;

    return response.text() || '';
  }
}

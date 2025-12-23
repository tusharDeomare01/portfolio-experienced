import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey && import.meta.env.DEV) {
  // Only warn in development
  console.warn('VITE_OPENAI_API_KEY is not set. AI Assistant will not work.');
}

export const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    })
  : null;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await openai.chat.completions.create(
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        signal, // Support AbortController for cancellation
      }
    );

    for await (const chunk of response) {
      // Check if request was aborted
      if (signal?.aborted) {
        return;
      }
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    // Don't throw if it's an abort error
    if (error.name === 'AbortError' || signal?.aborted) {
      return;
    }
    throw error;
  }
}


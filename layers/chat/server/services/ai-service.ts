import { generateText, streamText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import type { Message, LanguageModelV1 } from 'ai'

export const createDeepSeekModel = (apiKey: string) => {
  const deepseek = createDeepSeek({
    apiKey,
  })
  return deepseek('deepseek-chat')
}

export async function generateChatResponse(
  model: LanguageModelV1,
  messages: Message[]
): Promise<string> {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages format')
  }
  const result = await generateText({
    model,
    messages,
  })
  return result.text.trim()
}

export async function generateChatTitle(
  model: LanguageModelV1,
  firstMessage: string
): Promise<string> {
  const response = await generateText({
    model,
    messages: [
      {
        role: 'system',
        content:
          '您是生成简洁描述性聊天标题的助手。用3个词或更少概括第一条消息的精髓。',
      },
      {
        role: 'user',
        content: firstMessage,
      },
    ],
  })
  return response.text.trim()
}

export async function streamChatResponse(
  model: LanguageModelV1,
  messages: Message[]
) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages format')
  }

  return streamText({
    model,
    messages,
  }).textStream
}

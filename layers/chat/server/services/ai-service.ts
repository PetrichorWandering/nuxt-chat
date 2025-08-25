import OpenAI from "openai";

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatAnswer {
  content: string;         // 回答内容
  requestId?: string;      // 请求 ID
  tokens?: number;         // 总 token 数
  promptTokens?: number;   // 提示 tokens
  completionTokens?: number; // 回答 tokens
}

const { dashscopeApiKey, dashscopeBaseURL } = useRuntimeConfig();

const qwenModle = new OpenAI({
  apiKey: dashscopeApiKey,
  baseURL: dashscopeBaseURL,
})


/**
 * 生成聊天响应
 * @param chatMessages 聊天消息数组
 * @returns 聊天响应内容
 */
export async function generateChatResponse(
  chatMessages: ChatMessage[],
): Promise<ChatAnswer> {
  try {
    const response = await qwenModle.chat.completions.create({
      model: "qwen-turbo-2025-07-15",
      messages: [...chatMessages],
    }) as ChatCompletionResponse
    console.log("response:", response)
    if (!response || !Array.isArray(response.choices) || response.choices.length === 0) {
      throw new Error("Empty or invalid response from model.");
    }

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Response content is empty.");
    }

    const result: ChatAnswer = {
      content,
      requestId: response.id,
      tokens: response.usage?.total_tokens,
      promptTokens: response.usage?.prompt_tokens,
      completionTokens: response.usage?.completion_tokens,
    };
    console.info(
      `[🤖 Qwen Model Chat] requestId=${result.requestId}, 
      tokens(total=${result.tokens}, prompt=${result.promptTokens}, completion=${result.completionTokens})`
    );
    return result;
  } catch (error) {
    console.error("generateChatResponse error:", error);
    return {
      content: "❌ 生成回答失败，请稍后再试",
    };
  }
}

import OpenAI from "openai";

export interface AIMessage {
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
 * 千问模型调用方法
 * @param messages 消息数组
 * @param model 模型名称
 * @returns 模型响应
 */
async function callQwenModel(
  messages: AIMessage[],
  model: string = "qwen-turbo-2025-07-15",
): Promise<ChatAnswer> {
  const response = await qwenModle.chat.completions.create({
    model,
    messages,
  }) as ChatCompletionResponse;

  if (!response || !Array.isArray(response.choices) || response.choices.length === 0) {
    throw new Error("Empty or invalid response from model.");
  }

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Response content is empty.");
  }

  const result: ChatAnswer = {
      content: response.choices[0].message.content.trim(),
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
}


/**
 * 生成聊天响应
 * @param chatMessages 聊天消息数组
 * @returns 聊天响应内容
 */
export async function generateChatResponse(
  chatMessages: AIMessage[],
): Promise<string> {
  try {
    const response = await callQwenModel(chatMessages)
    return response.content;
  } catch (error) {
    console.error("generateChatResponse error:", error);
    return "❌ 生成回答失败，请稍后再试";
  }
}

/**
 * 生成聊天标题
 * @param firstMessage 聊天消息数组的第一个消息
 * @returns 聊天标题
 */
export async function generateChatTitle(
  firstMessage: string
): Promise<string> {
  try {
    const messages:AIMessage[] = [
      {
        role: 'system',
        content: `你是一个专业的标题生成器，请根据用户输入的内容生成一个简洁、准确的标题。

要求：
1. 标题长度控制在14个字符内
2. 直接返回标题内容，不要添加任何前缀或解释
3. 标题应该是用户输入的核心内容或者用户的意图的概括
4. 生成标题所使用的语言和用户输入内容语言保持一致

示例：
用户输入：今天天气怎么样？
输出：天气咨询

用户输入：介绍一下自己？
输出：自我介绍

用户输入：1,3,5,7 后一个数字应该是什么
输出：序列预测`,
      },
      {
        role: 'user',
        content: firstMessage,
      },
    ];

    const response = await callQwenModel(messages);
    return response.content;
  } catch (error) {
    console.error("generateChatTitle error:", error);
    return "新对话";
  }
}

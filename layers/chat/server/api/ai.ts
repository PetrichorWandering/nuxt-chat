import { createDeepSeekModel, generateChatResponse } from "../services/ai-service"
import { ChatMessageSchema } from '../schemas'

export default defineEventHandler(async (event) => {

  const { success, data } = await readValidatedBody(
    event,
    ChatMessageSchema.safeParse
  )

  if (!success) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }

  const { messages } = data as {
    messages: Message[]
    chatId: string
  }

  const deepseekApiKey = useRuntimeConfig().deepseekApiKey
  const deepseekModel = createDeepSeekModel(deepseekApiKey)

  const chatAnswer = await generateChatResponse(deepseekModel, messages)

  return {
    id: messages.length.toString(),
    role: 'assistant',
    content: chatAnswer,
  }

})
import { createDeepSeekModel, generateChatResponse } from "../services/ai-service"
import { ChatMessageSchema } from '../schemas'
import type { ChatMessage } from "../../shared/types/types"

export default defineEventHandler(async (event) => {

  const { success, data } = await readValidatedBody(
    event,
    ChatMessageSchema.safeParse
  )

  if (!success) {
    return 400
  }

  const { messages } = data as {
    messages: ChatMessage[]
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
import { 
  createMessageForChat, 
  getMessagesByChatId,
  getChatByIdForUser,
} from "~~/layers/chat/server/repository/chatRepository"
import { createDeepSeekModel, generateChatResponse } from "~~/layers/chat/server/services/ai-service"
import { getAuthenticatedUserId } from '#layers/auth/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const userId = await getAuthenticatedUserId(event)

  // Verify user owns the chat
  const chat = await getChatByIdForUser(id, userId)
  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found',
    })
  }

  const history = await getMessagesByChatId(id)

  const deepseekApiKey = useRuntimeConfig().deepseekApiKey
  const deepseekModel = createDeepSeekModel(deepseekApiKey)

  const reply = await generateChatResponse(deepseekModel, history)

  return createMessageForChat({
    chatId: id,
    role: 'assistant',
    content: reply,
  })


})

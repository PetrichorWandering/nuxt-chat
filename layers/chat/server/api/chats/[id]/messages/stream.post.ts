import { createMessageForChat, getMessagesByChatId, getChatByIdForUser } from '../../../../repository/chatRepository'
import { createDeepSeekModel, streamChatResponse } from '../../../../services/ai-service'
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

  const deepseekModel = createDeepSeekModel(useRuntimeConfig().deepseekApiKey)

  const stream = await streamChatResponse(deepseekModel, history)

  setResponseHeaders(event, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Transfer-Encoding': 'chunked',
  })

  let completeResponse = ''

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      completeResponse += chunk
      controller.enqueue(chunk)
    },

    async flush() {
      await createMessageForChat({
        chatId: id,
        content: completeResponse,
        role: 'assistant',
      })
    },
  })

  return stream.pipeThrough(transformStream)
})
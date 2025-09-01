import { createMessageForChat, getMessagesByChatId } from '../../../../repository/chatRepository'
import { createDeepSeekModel, streamChatResponse } from '../../../../services/ai-service'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

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
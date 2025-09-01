import { 
  createMessageForChat, 
  getMessagesByChatId 
} from "~~/layers/chat/server/repository/chatRepository"
import { createDeepSeekModel, generateChatResponse } from "~~/layers/chat/server/services/ai-service"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

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

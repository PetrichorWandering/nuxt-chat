import { 
  createMessageForChat, 
  getMessagesByChatId 
} from "~~/layers/chat/server/repository/chatRepository"
import { generateChatResponse } from "~~/layers/chat/server/services/ai-service"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const history = getMessagesByChatId(id)

  const reply = await generateChatResponse(history)

  return createMessageForChat({
    chatId: id,
    role: 'assistant',
    content: reply,
  })


})

import { updateChat } from "../../../repository/chatRepository"
import { generateChatTitle } from "../../../services/ai-service"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { message } = await readBody(event)
  const title = await generateChatTitle(message)

  return updateChat(id, { title })
})

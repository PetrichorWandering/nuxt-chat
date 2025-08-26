import { getMessagesByChatId } from "~~/layers/chat/server/repository/chatRepository"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const messages = getMessagesByChatId(id)
  return messages
})
import { generateChatResponse } from "../services/ai-service"


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { messages } = body
  const id = messages.length.toString()

  const chatAnswer = await generateChatResponse(messages)

  return {
    id,
    role: 'assistant',
    content: chatAnswer.content,
  }

})
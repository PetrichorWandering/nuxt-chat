import { updateChat } from "../../../repository/chatRepository"
import { createDeepSeekModel, generateChatTitle } from "../../../services/ai-service"
import { UpdateChatTitleSchema } from "../../../schemas"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { success, data } = await readValidatedBody(
    event,
    UpdateChatTitleSchema.safeParse
  )
  if (!success) {
    return 400
  }

  const deepseekApiKey = useRuntimeConfig().deepseekApiKey
  const deepseekModel = createDeepSeekModel(deepseekApiKey)

  const title = await generateChatTitle(deepseekModel, data.message)

  return updateChat(id, { title })
})

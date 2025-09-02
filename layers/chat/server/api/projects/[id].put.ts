import { getProjectById, updateProject } from "../../repository/projectRepository"
import { UpdateProjectSchema } from "../../schemas"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { success, data } = await readValidatedBody(
    event,
    UpdateProjectSchema.safeParse
  )
  const project = getProjectById(id)
  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project Not Found',
    })
  }
  if (!success) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }
  
  return updateProject(id, { name: data.name })
})
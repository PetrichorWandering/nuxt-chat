import type { Project } from "~~/layers/chat/shared/types/types";

export default function usePorjects() {
  const projects = useState<Project[]>('projects', () => [
    MOCK_PROJECT
  ])

  function createProject() {
    const id = (projects.value.length + 1).toString()
    const project = {
      id,
      name: "新的项目",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.value.push(project)
    return project
  }

  return {
    projects,
    createProject,
  }
}
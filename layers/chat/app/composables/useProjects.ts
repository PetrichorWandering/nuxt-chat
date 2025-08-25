import type { Project } from "~~/layers/base/app/types";

export default function usePorjects() {
  const projects = useState<Project[]>('projects', () => [
    MOCK_PROJECT
  ])

  function createProject() {
    const id = (projects.value.length + 1).toString()
    const project = {
      id,
      name: "新的项目"
    }

    projects.value.push(project)
    return project
  }

  return {
    projects,
    createProject,
  }
}
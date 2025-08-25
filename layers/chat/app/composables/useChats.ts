import type { Chat } from "~~/layers/base/app/types";

export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [MOCK_CHAT])

  /**
   * 创建一个新的聊天
   */
  function createChat(
    options: { projectId?: string } = {}
  ) {
    const id = (chats.value.length + 1).toString()
    const chat: Chat = {
      id,
      title: `聊天 ${id}`,
      messages: [],
      projectId: options.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    chats.value.push(chat)

    return chat
  }

  /**
   * 创建一个新的聊天并导航到它
   */
  async function createChatAndNavigate(
    options: { projectId?: string } = {}
  ) {
    const chat = createChat(options)
    if (chat.projectId) {
      navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`)
    } else {
      navigateTo(`/chats/${chat.id}`)
    }
  }

  function chatsInProject(projectId: string) {
    return chats.value.filter((c) => c.projectId === projectId)
  }

  return {
    chats,
    createChat,
    createChatAndNavigate,
    chatsInProject,
  }
}
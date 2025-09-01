export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [])
  const { data, execute, status } = useFetch<Chat[]>('/api/chats', {
    immediate: false,
    default: ()=> [],
  })
    
  async function fetchChats() {
    if (status.value !== 'idle') return
    await execute()
    chats.value = data.value
  }

  async function prefetchChatMessages() {
    const recentChats = chats.value
      .toSorted(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
      .slice(0, 2)

    await Promise.all(
      recentChats.map(async (chat) => {
        try {
          const messages = await $fetch<ChatMessage[]>(
            `/api/chats/${chat.id}/messages`
          )

          const targetChat = chats.value.find(
            (c) => c.id === chat.id
          )
          if (targetChat) {
            targetChat.messages = messages
          }
        } catch (error) {
          console.error(
            `Failed to fetch messages for chat ${chat.id}`,
            error
          )
        }
      })
    )
  }

  /**
   * 创建一个新的聊天
   */
  async function createChat(
    options: { 
      projectId?: string; 
      title?: string 
    } = {}
  ) {
    const newChat = await $fetch<Chat>('/api/chats', {
      method: 'POST',
      body: {
        projectId: options.projectId,
        title: options.title,
      },
    })

    chats.value.push(newChat)

    return newChat
  }

  /**
   * 创建一个新的聊天并导航到它
   */
  async function createChatAndNavigate(
    options: { projectId?: string } = {}
  ) {
    const chat = await createChat(options)
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
    fetchChats,
    prefetchChatMessages,
  }
}
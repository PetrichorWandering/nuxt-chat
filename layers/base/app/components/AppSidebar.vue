<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import type { Project, Chat } from '~~/layers/base/app/types';
import { filterChatsByDateRange } from '../utils/dateUtils';

defineProps<{
  isOpen: boolean,
}>()

const route = useRoute()
const { projects, createProject } = useProjects()

const { chats, chatsInProject, createChatAndNavigate } = useChats()

function isCurrentProject(projectId: string): boolean {
  return route.params.projectId === projectId
}
const chatsInCurrentProject = computed(() => 
  chatsInProject(route.params.projectId as string)
)

function formatProjectChat(
  project: Project,
  chat: Chat,
): NavigationMenuItem {
  return {
    label: chat.title || "无标题聊天",
    to: `/projects/${project.id}/chats/${chat.id}`,
    active: route.params.id === chat.id,
  } 
}

function formatProjectItem(
  project: Project,
): NavigationMenuItem {
  const isCurrent = isCurrentProject(project.id)

  const baseItem: NavigationMenuItem = {
    label: project.name,
    to: `/projects/${project.id}`,
    active: isCurrent,
    defaultOpen: isCurrent,
  }

  if (isCurrent) {
    return {
      ...baseItem,
      children: chatsInCurrentProject.value.map((chat: Chat) => 
        formatProjectChat(project, chat)
      ),
    }
  }

  return baseItem
}

const projectItems = computed<NavigationMenuItem[]>(() => 
  projects.value?.map(formatProjectItem) || []
)

async function handleCreateProject() {
  const newProject = await createProject()
  await createChatAndNavigate({
    projectId: newProject.id,
  })
}

const chatsWithoutProject = computed(() => 
  chats.value.filter((chat) => chat.projectId === undefined)
)

function filterChats(startDays: number, endDays?: number) {
  return computed(() => {
    return filterChatsByDateRange(chatsWithoutProject.value, startDays, endDays)
      .map(formatChatItem)
  })
}

const todayChats = filterChats(-1, 1)
const lastWeekChats = filterChats(1, 7)
const lastMonthChats = filterChats(7, 30)
const olderChats = filterChats(30)

function formatChatItem(chat: Chat): NavigationMenuItem {
  return {
    label: chat.title || "无标题聊天",
    to: `/chats/${chat.id}`,
    active: route.params.id === chat.id,
  }
}

async function handleCreateChat() {
  await createChatAndNavigate()
}
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-muted border-r-default border-r"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div
      v-if="projectItems.length > 0"
      class="mb-4 overflow-auto p-4 border-b border-default"
    >
      <div class="flex justify-between items-center mb-2">
        <h2
          class="text-sm font-semibold text-(--ui-text-muted)"
        >
          项目
        </h2>
      </div>
      <UNavigationMenu
        orientation="vertical"
        class="w-full mb-4"
        :items="projectItems"
        default-open
      />
      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        @click="handleCreateProject"
      >
        新建项目
      </UButton>
    </div>
    <div v-if="chatsWithoutProject.length > 0" class="overflow-auto p-4">
      <div v-if="todayChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            今天
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          class="w-full mb-4"
          :items="todayChats"
        />
      </div>
      <div v-if="lastWeekChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            最近一周
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          class="w-full mb-4"
          :items="lastWeekChats"
          default-open
        />
      </div>
      <div v-if="lastMonthChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            最近一个月
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          class="w-full mb-4"
          :items="lastMonthChats"
          default-open
        />
      </div>
      <div v-if="olderChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            更早的聊天
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          class="w-full mb-4"
          :items="olderChats"
          default-open
        />
      </div>
    </div>
    <div v-else class="overflow-y-auto p-4">
      <UAlert
        title="没有聊天"
        description="创建一个新的聊天开始。"
        color="neutral"
        variant="soft"
        class="mt-2"
      />
      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        @click="handleCreateChat"
      >
        新的聊天
      </UButton>
    </div>
  </aside>
</template>
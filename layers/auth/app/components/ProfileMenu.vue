<template>
  <UDropdownMenu v-if="isAuthenticated" :items="menuItems">
    <UAvatar
      :src="userAvatar || undefined"
      :alt="userName"
      size="sm"
      class="cursor-pointer"
    />
  </UDropdownMenu>

  <UButton
    v-else
    variant="outline"
    size="sm"
    @click="handleLogin"
  >
    Login
  </UButton>
</template>

<script setup lang="ts">
const { isAuthenticated, userName, userAvatar, logout } =
  useAuth()

async function handleLogin() {
  await navigateTo('/login')
}

async function handleLogout() {
  await logout()
}

const menuItems = computed(() => [
  [
    {
      label: userName.value,
      slot: 'label',
      icon: 'i-lucide-user',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout,
    },
  ],
])
</script>

<style>

</style>
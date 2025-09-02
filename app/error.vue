<script setup lang="ts">
const error = useError()

if (error.value) {
  console.error('Nuxt error:', error.value)
}

function handleError() {
  clearError({ redirect: '/'})
}
</script>

<template>
  <UContainer
    class="flex justify-center items-center h-full p-4"
  >
    <UCard variant="soft" class="min-w-md">
      <template #header>
        <h1 class="text-lg font-bold">
          Error - {{ error?.statusCode }}
        </h1>
      </template>
      <p>{{ error?.message }}</p>
      <UButton
        class="mt-4"
        color="primary"
        variant="soft"
        icon="i-heroicons-arrow-left"
        @click="handleError"
      >
        返回首页
      </UButton>
    </UCard>
  </UContainer>
</template>
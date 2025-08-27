<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

const textEl = ref<HTMLSpanElement | null>(null)

const animate = (el: HTMLSpanElement) => {
  const chars = el.textContent?.length || 0
  el.animate(
    [
      {clipPath: 'inset(0 100% 0 0)'},
      {clipPath: 'inset(0 0 0 0)'}
    ],
    {
      duration: Math.min(chars * 50, 1000), // Cap at 1 second
      easing: 'steps(' + chars + ', end)',
    }
  )
}

watch(
  () => props.text,
  () => {
    if (textEl.value) {
      animate(textEl.value)
    }
  }
)
</script>

<template>
  <span ref="textEl" class="typewriter-text">
    {{ text }}
  </span>
</template>

<style scoped>
.typewriter-text {
  display: inline-block;
  position: relative;
  white-space: nowrap;
}
</style>
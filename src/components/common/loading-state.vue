<script setup lang="ts">
interface Props {
  text?: string
  spinning?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  spinning: true,
})
</script>

<template>
  <div class="relative">
    <div v-if="spinning" class="absolute inset-0 z-10 flex-col-center gap-12px bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <NSpin :size="32" />
      <p class="text-14px text-slate-500">{{ text }}</p>
    </div>
    <div :class="{ 'pointer-events-none opacity-50': spinning }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

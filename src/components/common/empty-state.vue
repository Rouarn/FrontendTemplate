<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  description?: string
  icon?: string
  imageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  icon: 'ph:empty-duotone',
  imageSize: 120,
})

const iconSize = computed(() => `${props.imageSize}px`)
</script>

<template>
  <div class="flex-col-center gap-16px py-40px">
    <SvgIcon
      :icon="icon"
      :style="{ width: iconSize, height: iconSize }"
      class="text-slate-300 dark:text-slate-600"
    />
    <p class="text-14px text-slate-400 dark:text-slate-500">{{ description }}</p>
    <slot />
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

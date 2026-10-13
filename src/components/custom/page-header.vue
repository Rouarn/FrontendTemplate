<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'PageHeader' })

interface Props {
  /** Header icon (iconify name) */
  icon: string
  /** Page title */
  title: string
  /** Page description */
  description?: string
  /** Icon tint color, defaults to theme primary */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  color: '',
})

/** 图标容器与水印的样式（默认跟随主题色） */
const iconStyle = computed(() => {
  if (!props.color) return {}
  return { color: props.color, backgroundColor: `${props.color}14` }
})
</script>

<template>
  <NCard :bordered="false" class="page-header card-wrapper overflow-hidden">
    <div class="relative flex items-center gap-24px p-4px">
      <!-- 右侧水印图标 -->
      <SvgIcon
        :icon="icon"
        class="pointer-events-none absolute -right-8px -top-22px size-120px"
        :style="{ color: color || 'rgb(var(--primary-color))', opacity: 0.07 }"
      />
      <div
        class="header-icon flex-center size-72px shrink-0 rd-20px bg-primary/10 text-primary shadow-low"
        :style="iconStyle"
      >
        <SvgIcon :icon="icon" class="text-36px" />
      </div>
      <div class="relative min-w-0 flex-1">
        <h1 class="truncate text-24px font-bold text-base-text">{{ title }}</h1>
        <p v-if="description" class="mt-8px text-15px leading-relaxed text-slate-500">
          {{ description }}
        </p>
      </div>
      <div class="relative shrink-0">
        <slot />
      </div>
    </div>
  </NCard>
</template>

<style scoped></style>

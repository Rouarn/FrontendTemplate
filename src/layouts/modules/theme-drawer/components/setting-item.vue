<script setup lang="ts">
defineOptions({
  name: 'SettingItem',
})

interface Props {
  /** 标签 */
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="w-full flex-y-center justify-between gap-8px">
    <div class="flex min-w-0 items-center">
      <span class="truncate pr-8px text-base-text">{{ label }}</span>
      <slot name="suffix"></slot>
    </div>
    <div class="shrink-0">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>

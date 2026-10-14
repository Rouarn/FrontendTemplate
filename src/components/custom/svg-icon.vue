<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'SvgIcon', inheritAttrs: false })

/**
 * 组件入参
 *
 * - 支持 iconify 图标与本地 svg 图标
 * - icon 与 localIcon 同时传入时，优先渲染 localIcon
 */
interface Props {
  /** Iconify 图标名称 */
  icon?: string
  /** 本地 svg 图标名称 */
  localIcon?: string
}

const props = defineProps<Props>()

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env

  const defaultLocalIcon = 'no-icon'

  const icon = props.localIcon || defaultLocalIcon

  return `#${prefix}-${icon}`
})

/** 传入 localIcon 时优先渲染本地图标 */
const renderLocalIcon = computed(() => props.localIcon || !props.icon)
</script>

<template>
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>

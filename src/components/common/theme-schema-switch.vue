<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/locales'
import type { PopoverPlacement } from 'naive-ui'

defineOptions({ name: 'ThemeSchemaSwitch' })

interface Props {
  /** 主题模式 */
  themeSchema: UnionKey.ThemeScheme
  /** 是否显示提示 */
  showTooltip?: boolean
  /** 提示弹出位置 */
  tooltipPlacement?: PopoverPlacement
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom',
})

interface Emits {
  (e: 'switch'): void
}

const emit = defineEmits<Emits>()

function handleSwitch() {
  emit('switch')
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto',
}

const icon = computed(() => icons[props.themeSchema])

const tooltipContent = computed(() => {
  if (!props.showTooltip) return ''

  return $t('icon.themeSchema')
})
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>

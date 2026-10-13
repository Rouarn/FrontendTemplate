<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useThemeStore } from '@/stores/modules/theme'
import { $t } from '@/locales'
import Clipboard from 'clipboard'

defineOptions({
  name: 'ConfigOperation',
})

const themeStore = useThemeStore()

const domRef = ref<HTMLElement | null>(null)

function initClipboard() {
  if (!domRef.value) return

  const clipboard = new Clipboard(domRef.value)

  clipboard.on('success', () => {
    window.$message?.success($t('theme.configOperation.copySuccessMsg'))
  })
}

function getClipboardText() {
  const reg = /"\w+":/g

  const json = themeStore.settingsJson

  return json.replace(reg, (match: string) => match.replace(/"/g, ''))
}

function handleReset() {
  themeStore.resetStore()

  setTimeout(() => {
    window.$message?.success($t('theme.configOperation.resetSuccessMsg'))
  }, 50)
}

const dataClipboardText = computed(() => getClipboardText())

onMounted(() => {
  initClipboard()
})
</script>

<template>
  <div class="flex w-full gap-12px">
    <textarea
      id="themeConfigCopyTarget"
      v-model="dataClipboardText"
      class="pointer-events-none absolute opacity-0 -z-1"
    />
    <NButton class="m-0 flex-1 rd-10px" type="error" ghost @click="handleReset">
      <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
      {{ $t('theme.configOperation.resetConfig') }}
    </NButton>
    <div ref="domRef" class="flex-1" data-clipboard-target="#themeConfigCopyTarget">
      <NButton class="m-0 w-full rd-10px shadow-low" type="primary">
        <template #icon><SvgIcon icon="ph:copy-duotone" /></template>
        {{ $t('theme.configOperation.copyConfig') }}
      </NButton>
    </div>
  </div>
</template>

<style scoped></style>

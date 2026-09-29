<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  url: string
}

const props = defineProps<Props>()

/** iframe 实际地址（路由参数已由 vue-router 解码） */
const iframeSrc = ref(props.url)
const displayUrl = computed(() => props.url)

/** 在新窗口打开 */
function openInNewTab() {
  window.open(props.url, '_blank', 'noopener')
}

/** 刷新 iframe */
function reload() {
  iframeSrc.value = ''
  requestAnimationFrame(() => {
    iframeSrc.value = props.url
  })
}
</script>

<template>
  <div class="flex h-[calc(100vh-128px)] min-h-460px flex-col overflow-hidden rd-18px border border-base-text/10 bg-container shadow-low">
    <!-- 工具栏 -->
    <div class="flex items-center gap-12px border-b border-base-text/8 px-16px py-11px">
      <span class="size-11px rd-full bg-[#ff5f57]" />
      <span class="size-11px rd-full bg-[#febc2e]" />
      <span class="size-11px rd-full bg-[#28c840]" />

      <!-- 地址栏 -->
      <div class="ml-8px flex h-30px flex-1 items-center gap-8px rd-9px bg-layout px-12px">
        <SvgIcon icon="ph:lock-simple-fill" class="shrink-0 text-11px text-success" />
        <span class="truncate text-12px text-slate-500">{{ displayUrl }}</span>
      </div>

      <!-- 操作按钮 -->
      <NButton quaternary size="small" class="shrink-0" @click="reload">
        <template #icon><SvgIcon icon="ph:arrow-clockwise-duotone" class="text-17px" /></template>
      </NButton>
      <NButton quaternary size="small" class="shrink-0" @click="openInNewTab">
        <template #icon><SvgIcon icon="ph:arrow-square-out-duotone" class="text-17px" /></template>
      </NButton>
    </div>

    <!-- iframe 内容 -->
    <div class="min-h-0 flex-1 bg-white">
      <iframe id="iframePage" class="size-full border-0" :src="iframeSrc" title="iframe page" />
    </div>
  </div>
</template>

<style scoped></style>

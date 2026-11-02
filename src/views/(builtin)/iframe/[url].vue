<script setup lang="ts">
import { computed, ref } from 'vue'
import { $t } from '@/locales'

interface Props {
  url: string
}

const props = defineProps<Props>()

/**
 * 仅允许 http/https 的绝对地址
 *
 * `javascript:` / `data:` / `file:` 等协议会被直接拒绝，
 * 避免该页面被构造成钓鱼或脚本注入入口。
 */
const parsedUrl = computed<URL | null>(() => {
  try {
    const url = new URL(props.url)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
})

/** iframe 实际地址（路由参数已由 vue-router 解码） */
const iframeSrc = ref(parsedUrl.value?.href ?? '')

/** 在新窗口打开 */
function openInNewTab() {
  if (!parsedUrl.value) return
  window.open(parsedUrl.value.href, '_blank', 'noopener,noreferrer')
}

/** 刷新 iframe */
function reload() {
  if (!parsedUrl.value) return
  iframeSrc.value = ''
  requestAnimationFrame(() => {
    iframeSrc.value = parsedUrl.value?.href ?? ''
  })
}
</script>

<template>
  <div
    v-if="parsedUrl"
    class="flex h-[calc(100vh-128px)] min-h-460px flex-col overflow-hidden rd-18px border border-base-text/10 bg-container shadow-low"
  >
    <!-- 工具栏 -->
    <div class="flex items-center gap-12px border-b border-base-text/8 px-16px py-11px">
      <span class="size-11px rd-full bg-[#ff5f57]" />
      <span class="size-11px rd-full bg-[#febc2e]" />
      <span class="size-11px rd-full bg-[#28c840]" />

      <!-- 地址栏：只展示来源与路径，不暗示任何安全承诺 -->
      <div class="ml-8px flex h-30px flex-1 items-center gap-8px rd-9px bg-layout px-12px">
        <SvgIcon icon="ph:globe-simple-duotone" class="shrink-0 text-13px text-slate-400" />
        <span class="truncate text-12px text-slate-500">{{ parsedUrl.href }}</span>
      </div>

      <!-- 操作按钮 -->
      <NButton quaternary size="small" class="shrink-0" @click="reload">
        <template #icon><SvgIcon icon="ph:arrow-clockwise-duotone" class="text-17px" /></template>
      </NButton>
      <NButton quaternary size="small" class="shrink-0" @click="openInNewTab">
        <template #icon><SvgIcon icon="ph:arrow-square-out-duotone" class="text-17px" /></template>
      </NButton>
    </div>

    <!-- iframe 内容：禁止顶层跳转/表单逃逸，不携带 referrer -->
    <div class="min-h-0 flex-1 bg-white">
      <iframe
        id="iframePage"
        class="size-full border-0"
        :src="iframeSrc"
        title="iframe page"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        referrerpolicy="no-referrer"
        loading="lazy"
      />
    </div>
  </div>

  <!-- 非法地址：不渲染 iframe，避免被当作钓鱼页面 -->
  <div v-else class="flex-center min-h-460px rd-18px border border-base-text/10 bg-container">
    <NResult status="403" :title="$t('page.iframe.invalid')" :description="url" />
  </div>
</template>

<style scoped></style>

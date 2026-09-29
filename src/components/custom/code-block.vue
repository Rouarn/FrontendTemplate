<script setup lang="ts">
defineOptions({ name: 'CodeBlock' })

interface Props {
  /** Code window title */
  title?: string
  /** Code content (prefer over slot to preserve line breaks) */
  code?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  code: '',
})
</script>

<template>
  <div class="code-block overflow-hidden rd-16px border border-base-text/10 bg-layout">
    <!-- 标题栏 -->
    <div class="flex items-center gap-10px border-b border-base-text/8 px-16px py-10px">
      <span class="size-10px rd-full bg-[#ff5f57]" />
      <span class="size-10px rd-full bg-[#febc2e]" />
      <span class="size-10px rd-full bg-[#28c840]" />
      <span v-if="title" class="ml-6px text-12px font-medium text-slate-400">{{ title }}</span>
      <div class="ml-auto flex items-center gap-8px">
        <slot name="extra" />
      </div>
    </div>
    <!-- 代码内容 -->
    <pre class="overflow-x-auto p-20px text-13px leading-7 font-mono text-base-text/85"><code>{{ code }}<slot v-if="!code" /></code></pre>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'DirectivesCopyDirect',
})

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊')
const copySuccess = ref(false)

const handleCopy = () => {
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

/** 代码实现示例 */
const usageCode = `<!-- 基础用法 -->
<NButton v-copy="'Hello World'">复制文本</NButton>

<!-- 动态内容 -->
<NInput v-model:value="inputValue" />
<NButton v-copy="inputValue">复制输入框内容</NButton>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Page Header -->
    <PageHeader
      icon="ph:copy-duotone"
      title="复制指令 `v-copy`"
      description="便捷的一键复制功能，支持动态绑定内容，显著提升用户的操作效率"
    />

    <!-- Playground -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:clipboard-text-duotone" class="text-21px text-primary" />
          试试复制功能
        </span>
      </template>
      <div class="max-w-600px mx-auto py-32px">
        <div class="flex gap-12px">
          <NInput v-model:value="data" size="large" placeholder="输入要复制的文本" class="rd-12px flex-1" />
          <NButton
            v-copy="data"
            type="primary"
            size="large"
            class="rd-12px px-24px font-bold shadow-low transition-all duration-300 active:scale-95"
            :class="{ 'bg-success border-success': copySuccess }"
            @click="handleCopy"
          >
            <template #icon>
              <SvgIcon :icon="copySuccess ? 'ph:check-bold' : 'ph:copy-duotone'" />
            </template>
            {{ copySuccess ? '复制成功' : '点击复制' }}
          </NButton>
        </div>

        <div class="mt-24px p-16px rd-12px bg-primary/5 border border-primary/10 flex items-start gap-12px">
          <SvgIcon icon="ph:info-duotone" class="text-20px text-primary mt-2px" />
          <p class="text-14px text-slate-600 leading-relaxed">
            <span class="font-bold text-primary">提示：</span>
            在任意 HTML 元素或组件上添加 <code>v-copy="content"</code> 指令即可实现复制功能。支持响应式数据，当 content
            改变时，复制的内容也会同步更新。
          </p>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

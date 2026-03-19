<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'copyDirect',
})

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊')
const copySuccess = ref(false)

const handleCopy = () => {
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:copy-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">复制指令 `v-copy`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">便捷的一键复制功能，支持动态绑定内容，显著提升用户的操作效率</p>
        </div>
      </div>
    </NCard>

    <!-- Playground -->
    <NCard title="📋 试试复制功能" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
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
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 --&gt;
&lt;NButton v-copy="'Hello World'"&gt;复制文本&lt;/NButton&gt;

&lt;!-- 动态内容 --&gt;
&lt;NInput v-model:value="inputValue" /&gt;
&lt;NButton v-copy="inputValue"&gt;复制输入框内容&lt;/NButton&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

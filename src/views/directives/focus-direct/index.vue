<script setup lang="ts" name="focusDirect">
import { ref } from 'vue'

const focusEnabled = ref(true)
const inputValue = ref('')
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:eye-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">聚焦指令 `v-focus`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">自动为输入框或特定元素设置焦点，提升表单填写与交互的流畅度</p>
        </div>
      </div>
    </NCard>

    <!-- Playground -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px">
      <NCard title="🎯 基础用法" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">页面加载时，自动将焦点锁定到该输入框。</p>
          <NInput v-focus v-model:value="inputValue" size="large" placeholder="页面加载时我将自动聚焦" class="rd-12px" />
        </div>
      </NCard>

      <NCard title="⚙️ 条件控制" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div class="flex justify-between items-center">
            <p class="text-14px text-slate-500">通过开关触发聚焦行为。</p>
            <NSwitch v-model:value="focusEnabled" size="small" />
          </div>
          <NInput v-focus="focusEnabled" size="large" placeholder="根据上方开关决定是否聚焦" class="rd-12px" :key="String(focusEnabled)" />
        </div>
      </NCard>
    </div>

    <!-- Features -->
    <NCard title="✨ 核心特性" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-24px">
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-primary/10 text-primary rd-10px flex-shrink-0">
            <SvgIcon icon="ph:lightning-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">即时生效</h4>
            <p class="text-13px text-slate-500 mt-4px">元素挂载后立即触发 DOM focus 事件</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-blue-500/10 text-blue-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:toggle-left-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">逻辑解耦</h4>
            <p class="text-13px text-slate-500 mt-4px">无需在生命周期钩子中手动操作 DOM</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-amber-500/10 text-amber-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:selection-all-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">兼容性强</h4>
            <p class="text-13px text-slate-500 mt-4px">支持原生 input 以及各类 UI 组件库</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础聚焦 --&gt;
&lt;input v-focus /&gt;

&lt;!-- 条件聚焦 --&gt;
&lt;NInput v-focus="isReady" /&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

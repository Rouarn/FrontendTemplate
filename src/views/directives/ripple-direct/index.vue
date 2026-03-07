<script setup lang="ts" name="rippleDirect">
import { ref } from 'vue'

const rippleDisabled = ref(false)
const rippleCount = ref(0)

const handleRippleClick = () => {
  if (rippleDisabled.value) return
  rippleCount.value++
}

const resetCounter = () => {
  rippleCount.value = 0
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:waves-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">波纹指令 `v-ripple`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            为元素注入灵动的 Material Design 风格波纹反馈，提升交互的确定感与品质感
          </p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ rippleCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计触发波纹次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-12px">
          <div class="size-12px rd-full animate-pulse" :class="rippleDisabled ? 'bg-slate-300' : 'bg-success'" />
          <div class="text-32px font-bold text-blue-500 tabular-nums">{{ rippleDisabled ? '已禁用' : '运行中' }}</div>
        </div>
        <div class="text-14px text-slate-500 font-medium">波纹指令状态</div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard title="🌊 波纹交互演示" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <NSpace align="center" :size="16">
          <div class="flex items-center gap-8px">
            <span class="text-12px text-slate-400 font-medium">禁用波纹</span>
            <NSwitch v-model:value="rippleDisabled" size="small" />
          </div>
          <NButton quaternary @click="resetCounter">
            <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>重置统计数据
          </NButton>
        </NSpace>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-32px py-16px">
        <!-- Buttons Group -->
        <div class="space-y-24px">
          <h4 class="text-16px font-bold text-base-text mb-16px flex items-center gap-8px">
            <div class="w-4px h-16px bg-primary rd-full" />
            按钮交互
          </h4>
          <div class="flex flex-wrap gap-16px">
            <NButton v-ripple="!rippleDisabled" type="primary" size="large" class="rd-12px px-24px font-bold" @click="handleRippleClick">
              默认主色波纹
            </NButton>
            <NButton
              v-ripple="{ color: '#ef4444', disabled: rippleDisabled }"
              type="error"
              size="large"
              class="rd-12px px-24px font-bold"
              @click="handleRippleClick"
            >
              红色警告波纹
            </NButton>
            <NButton
              v-ripple="{ color: '#3b82f6', duration: 1000, disabled: rippleDisabled }"
              type="info"
              secondary
              size="large"
              class="rd-12px px-24px font-bold"
              @click="handleRippleClick"
            >
              慢速蓝色波纹
            </NButton>
          </div>
        </div>

        <!-- Shapes Group -->
        <div class="space-y-24px">
          <h4 class="text-16px font-bold text-base-text mb-16px flex items-center gap-8px">
            <div class="w-4px h-16px bg-amber-500 rd-full" />
            不同形状容器
          </h4>
          <div class="flex flex-wrap items-center gap-24px">
            <div
              v-ripple="{ color: '#059669', disabled: rippleDisabled }"
              class="size-80px bg-primary/10 rd-full flex-center cursor-pointer hover:bg-primary/20 transition-colors"
              @click="handleRippleClick"
            >
              <span class="text-12px font-bold text-primary">圆形</span>
            </div>
            <div
              v-ripple="{ color: '#f59e0b', disabled: rippleDisabled }"
              class="size-80px bg-amber-500/10 rd-16px flex-center cursor-pointer hover:bg-amber-500/20 transition-colors"
              @click="handleRippleClick"
            >
              <span class="text-12px font-bold text-amber-600">圆角</span>
            </div>
            <div
              v-ripple="{ color: '#6366f1', disabled: rippleDisabled }"
              class="w-120px h-80px bg-indigo-500/10 rd-8px flex-center cursor-pointer hover:bg-indigo-500/20 transition-colors"
              @click="handleRippleClick"
            >
              <span class="text-12px font-bold text-indigo-600">矩形</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 --&gt;
&lt;div v-ripple&gt;点击产生波纹&lt;/div&gt;

&lt;!-- 高级配置 --&gt;
&lt;div v-ripple="{ 
  color: 'rgba(255, 255, 255, 0.5)', 
  duration: 600,
  disabled: false 
}"&gt;...&lt;/div&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

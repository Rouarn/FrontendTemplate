<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'DirectivesTooltipDirect',
  inheritAttrs: false,
})

const tooltipCount = ref(0)
const tooltipPosition = ref<'top' | 'bottom' | 'left' | 'right'>('top')

const handleTooltipShow = () => {
  tooltipCount.value++
}

const positions = [
  { label: '上方', value: 'top', icon: 'ph:caret-up-bold' },
  { label: '下方', value: 'bottom', icon: 'ph:caret-down-bold' },
  { label: '左侧', value: 'left', icon: 'ph:caret-left-bold' },
  { label: '右侧', value: 'right', icon: 'ph:caret-right-bold' },
]

/** 代码实现示例 */
const usageCode = `<!-- 简易用法 -->
<div v-tooltip="'提示内容'">...</div>

<!-- 全量配置 -->
<div v-tooltip="{ 
  content: '自定义内容', 
  placement: 'right', 
  theme: 'dark',
  delay: 200 
}">...</div>`
</script>

<template>
  <div v-bind="$attrs" class="flex-col gap-16px">
    <!-- 页头 -->
    <PageHeader
      icon="ph:chat-teardrop-dots-duotone"
      title="提示指令 `v-tooltip`"
      description="轻量级的气泡提示解决方案，支持多方位弹出、自定义图标与丰富的视觉主题"
    />

    <!-- 数据统计 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ tooltipCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计显示提示次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-8px text-24px font-bold text-blue-500 uppercase">
          <SvgIcon :icon="positions.find((p) => p.value === tooltipPosition)?.icon" />
          {{ tooltipPosition }}
        </div>
        <div class="text-14px text-slate-500 font-medium">当前选中弹出位置</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper flex-center">
        <NSelect
          v-model:value="tooltipPosition"
          :options="positions"
          size="small"
          class="w-140px rd-8px"
        />
      </NCard>
    </div>

    <!-- 演练区 -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:chat-circle-dots-duotone" class="text-21px text-primary" />
          交互演示
        </span>
      </template>
      <div
        class="flex-col-center py-64px bg-layout/50 rd-24px border-2 border-dashed border-primary/10"
      >
        <div class="relative">
          <NButton
            v-tooltip="{
              content: '这是一个精准定位的提示框！',
              placement: tooltipPosition,
              theme: 'dark',
            }"
            type="primary"
            size="large"
            class="rd-16px px-40px text-18px font-bold shadow-low transition-all duration-300 active:scale-95"
            @mouseenter="handleTooltipShow"
          >
            <template #icon>
              <SvgIcon icon="ph:cursor-click-duotone" />
            </template>
            悬停我查看提示
          </NButton>
        </div>

        <div class="mt-48px grid grid-cols-1 md:grid-cols-3 gap-24px w-full max-w-800px px-24px">
          <div
            v-tooltip="'基础提示文字'"
            class="p-20px rd-16px bg-container border border-layout shadow-low flex-col-center gap-12px cursor-help hover:border-primary/30 transition-colors"
          >
            <SvgIcon icon="ph:text-t-duotone" class="text-32px text-slate-400" />
            <span class="text-14px font-bold text-base-text">基础用法</span>
          </div>
          <div
            v-tooltip="{ content: '操作已成功完成', icon: '✅', theme: 'success' }"
            class="p-20px rd-16px bg-container border border-layout shadow-low flex-col-center gap-12px cursor-help hover:border-success/30 transition-colors"
          >
            <SvgIcon icon="ph:check-circle-duotone" class="text-32px text-success" />
            <span class="text-14px font-bold text-base-text">成功主题</span>
          </div>
          <div
            v-tooltip="{ content: '这是一个警告提示', icon: '⚠️', theme: 'error' }"
            class="p-20px rd-16px bg-container border border-layout shadow-low flex-col-center gap-12px cursor-help hover:border-error/30 transition-colors"
          >
            <SvgIcon icon="ph:warning-circle-duotone" class="text-32px text-error" />
            <span class="text-14px font-bold text-base-text">错误主题</span>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 使用指南 -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

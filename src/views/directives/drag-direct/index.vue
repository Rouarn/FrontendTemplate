<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'DirectivesDragDirect',
})

const dragCount = ref(0)
const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
  dragCount.value++
}

const handleDragEnd = () => {
  isDragging.value = false
}

const resetCounter = () => {
  dragCount.value = 0
}

/** 代码实现示例 */
const usageCode = `<!-- 基础拖拽 -->
<div v-draggable>我是可拖拽的元素</div>

<!-- 限制在父容器内 -->
<div class="parent">
  <div v-draggable>我只能在父容器里跑</div>
</div>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- 页头 -->
    <PageHeader
      icon="ph:hand-grabbing-duotone"
      title="拖拽指令 `v-draggable`"
      description="赋予元素自由拖拽移动的能力，支持自定义边界限制与吸附效果"
    />

    <!-- 数据统计 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ dragCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计拖拽次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-12px">
          <div
            class="size-12px rd-full animate-pulse"
            :class="isDragging ? 'bg-success' : 'bg-slate-300'"
          />
          <div class="text-32px font-bold text-blue-500 tabular-nums">
            {{ isDragging ? '进行中' : '已停止' }}
          </div>
        </div>
        <div class="text-14px text-slate-500 font-medium">当前拖拽状态</div>
      </NCard>
    </div>

    <!-- 演练区 -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:arrows-out-cardinal-duotone" class="text-21px text-primary" />
          拖拽演示区域
        </span>
      </template>
      <template #header-extra>
        <NButton quaternary @click="resetCounter">
          <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
          重置统计数据
        </NButton>
      </template>

      <div
        class="relative h-500px rd-24px bg-layout/50 border-2 border-dashed border-primary/10 overflow-hidden"
      >
        <!-- 可拖拽盒子 -->
        <div
          v-draggable
          class="absolute top-100px left-100px z-50 cursor-grab active:cursor-grabbing group"
          @mousedown="handleDragStart"
          @mouseup="handleDragEnd"
        >
          <div
            class="size-140px bg-container rd-24px shadow-high border border-primary/10 flex-col-center gap-12px transition-transform duration-300 group-active:scale-105"
          >
            <div class="size-48px flex-center bg-primary/10 text-primary rd-16px">
              <SvgIcon icon="ph:hand-grabbing-duotone" class="text-24px" />
            </div>
            <span class="text-14px font-bold text-base-text">拖动我</span>
            <div class="px-8px py-2px rd-4px bg-primary/5 text-11px text-primary font-mono">
              v-draggable
            </div>
          </div>
        </div>

        <!-- 目标区装饰 -->
        <div class="absolute inset-0 flex-center pointer-events-none opacity-20">
          <div class="text-center">
            <SvgIcon
              icon="ph:arrows-out-cardinal-duotone"
              class="text-120px text-primary mb-16px"
            />
            <p class="text-18px font-bold text-primary">自由拖拽空间</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 使用指南 -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

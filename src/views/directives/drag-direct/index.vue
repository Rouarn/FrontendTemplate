<script setup lang="ts" name="dragDirect">
import { ref } from 'vue'

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
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:hand-grabbing-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">拖拽指令 `v-draggable`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">赋予元素自由拖拽移动的能力，支持自定义边界限制与吸附效果</p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ dragCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计拖拽次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-12px">
          <div class="size-12px rd-full animate-pulse" :class="isDragging ? 'bg-success' : 'bg-slate-300'" />
          <div class="text-32px font-bold text-blue-500 tabular-nums">{{ isDragging ? '进行中' : '已停止' }}</div>
        </div>
        <div class="text-14px text-slate-500 font-medium">当前拖拽状态</div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard title="🎮 拖拽演示区域" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <NButton quaternary @click="resetCounter">
          <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
          重置统计数据
        </NButton>
      </template>

      <div class="relative h-500px rd-24px bg-layout/50 border-2 border-dashed border-primary/10 overflow-hidden">
        <!-- Draggable Box -->
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
            <div class="px-8px py-2px rd-4px bg-primary/5 text-11px text-primary font-mono">v-draggable</div>
          </div>
        </div>

        <!-- Target Zone Decor -->
        <div class="absolute inset-0 flex-center pointer-events-none opacity-20">
          <div class="text-center">
            <SvgIcon icon="ph:arrows-out-cardinal-duotone" class="text-120px text-primary mb-16px" />
            <p class="text-18px font-bold text-primary">自由拖拽空间</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础拖拽 --&gt;
&lt;div v-draggable&gt;我是可拖拽的元素&lt;/div&gt;

&lt;!-- 限制在父容器内 --&gt;
&lt;div class="parent"&gt;
  &lt;div v-draggable&gt;我只能在父容器里跑&lt;/div&gt;
&lt;/div&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

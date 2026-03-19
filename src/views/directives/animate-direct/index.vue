<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'animateDirect',
  inheritAttrs: false,
})

const animations = [
  { label: '淡入', value: 'fadeIn', icon: 'ph:eye-duotone' },
  { label: '淡出', value: 'fadeOut', icon: 'ph:eye-slash-duotone' },
  { label: '左滑入', value: 'slideInLeft', icon: 'ph:arrow-left-duotone' },
  { label: '右滑入', value: 'slideInRight', icon: 'ph:arrow-right-duotone' },
  { label: '上滑入', value: 'slideInUp', icon: 'ph:arrow-up-duotone' },
  { label: '下滑入', value: 'slideInDown', icon: 'ph:arrow-down-duotone' },
  { label: '放大', value: 'zoomIn', icon: 'ph:magnifying-glass-plus-duotone' },
  { label: '缩小', value: 'zoomOut', icon: 'ph:magnifying-glass-minus-duotone' },
  { label: '弹跳', value: 'bounce', icon: 'ph:basketball-duotone' },
  { label: '摇晃', value: 'shake', icon: 'ph:vibrate-duotone' },
  { label: '摇摆', value: 'swing', icon: 'ph:metronome-duotone' },
  { label: '脉冲', value: 'pulse', icon: 'ph:heartbeat-duotone' },
  { label: '翻转', value: 'flipInX', icon: 'ph:faders-horizontal-duotone' },
  { label: '旋转', value: 'rotateIn', icon: 'ph:spinner-duotone' },
]

const animationCount = ref(0)
const selectedAnimation = ref('fadeIn')
const animationKeyMap = ref<Record<string, number>>({})

// 初始化每个动画的 key
animations.forEach((item) => {
  animationKeyMap.value[item.value] = 0
})

const handleAnimationStart = () => {
  animationCount.value++
}

const triggerAnimation = (animation: string) => {
  selectedAnimation.value = animation
  animationKeyMap.value[animation]++
}
</script>

<template>
  <div v-bind="$attrs" class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:magic-wand-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">动画指令 `v-animate`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">通过指令轻松为元素注入生命力，支持多种内置动画效果与自定义配置</p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ animationCount }}</div>
        <div class="text-14px text-slate-500 font-medium">动画触发次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-20px font-bold text-amber-500 truncate px-8px">{{ selectedAnimation }}</div>
        <div class="text-14px text-slate-500 font-medium">当前选中效果</div>
      </NCard>
    </div>

    <!-- Animation Playground -->
    <NCard title="🎬 动画效果演示" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-20px py-24px">
        <div
          v-for="item in animations"
          :key="item.value"
          v-animate="{ name: item.value, key: animationKeyMap[item.value] }"
          class="flex-col-center gap-12px p-20px rd-16px bg-layout border border-transparent transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 cursor-pointer group"
          @click="triggerAnimation(item.value)"
          @animationstart="handleAnimationStart"
        >
          <div class="size-48px flex-center bg-container rd-12px shadow-low group-hover:shadow-high transition-shadow">
            <SvgIcon :icon="item.icon" class="text-24px text-primary" />
          </div>
          <span class="text-14px font-bold text-base-text">{{ item.label }}</span>
          <span class="text-11px text-slate-400 font-mono">{{ item.value }}</span>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 使用指南" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>// 基础用法
&lt;div v-animate="'fadeIn'"&gt;淡入动画&lt;/div&gt;

// 带参数用法 (持续时间, 延迟)
&lt;div v-animate="{ type: 'zoomIn', duration: 1000, delay: 200 }"&gt;缩放动画&lt;/div&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

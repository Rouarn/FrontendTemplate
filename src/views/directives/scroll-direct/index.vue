<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'scrollDirect',
})

const scrollStats = ref({
  position: 0,
  percentage: 0,
  direction: 'none',
  velocity: 0,
})

interface ScrollData {
  position: number
  percentage: number
  direction: string
  velocity: number
}

const onScrollUpdate = (data: ScrollData) => {
  scrollStats.value = data
}

const scrollToTop = () => {
  const element = document.querySelector('.scroll-demo-container')
  if (element) {
    element.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToBottom = () => {
  const element = document.querySelector('.scroll-demo-container')
  if (element) {
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:mouse-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">滚动指令 `v-scroll`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">实时监听并精准控制容器滚动状态，支持方向识别、百分比计算与平滑定位</p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ Math.round(scrollStats.position) }}px</div>
        <div class="text-14px text-slate-500 font-medium">当前滚动距离</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-blue-500 tabular-nums">{{ Math.round(scrollStats.percentage) }}%</div>
        <div class="text-14px text-slate-500 font-medium">已滚动百分比</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-8px text-24px font-bold text-amber-500 uppercase">
          <SvgIcon
            :icon="
              scrollStats.direction === 'down'
                ? 'ph:arrow-down-bold'
                : scrollStats.direction === 'up'
                  ? 'ph:arrow-up-bold'
                  : 'ph:minus-bold'
            "
          />
          {{ scrollStats.direction === 'none' ? '静止' : scrollStats.direction === 'down' ? '向下' : '向上' }}
        </div>
        <div class="text-14px text-slate-500 font-medium">滚动方向</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-purple-500 tabular-nums">{{ Math.round(scrollStats.velocity) }}</div>
        <div class="text-14px text-slate-500 font-medium">滚动即时速度</div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard title="🖱️ 滚动演示与控制" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <NSpace>
          <NButton size="small" secondary strong @click="scrollToTop">回到顶部</NButton>
          <NButton size="small" secondary strong @click="scrollToBottom">滚到底部</NButton>
        </NSpace>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-24px">
        <!-- Scroll Container -->
        <div class="lg:col-span-2 relative">
          <div
            v-scroll="onScrollUpdate"
            class="scroll-demo-container h-400px rd-16px bg-layout border border-primary/10 overflow-y-auto p-24px"
          >
            <div class="space-y-16px">
              <div
                v-for="i in 20"
                :key="i"
                class="p-20px rd-12px bg-container shadow-low border border-layout transition-all hover:border-primary/20"
              >
                <div class="flex justify-between items-center mb-8px">
                  <span class="text-16px font-bold text-base-text">列表项 #{{ i }}</span>
                  <NTag :type="i % 2 === 0 ? 'primary' : 'success'" size="small" round>Category</NTag>
                </div>
                <p class="text-14px text-slate-500">
                  这是一段用于模拟滚动内容的占位文本，你可以通过鼠标滚轮或拖动滚动条来查看滚动指令的实时反馈。
                </p>
              </div>
            </div>
          </div>
          <!-- Progress Bar Overlay -->
          <div class="absolute top-0 left-0 w-full h-4px bg-primary/5">
            <div class="h-full bg-primary transition-all duration-150" :style="{ width: `${scrollStats.percentage}%` }" />
          </div>
        </div>

        <!-- Scroll Info/Tips -->
        <div class="space-y-16px">
          <div class="p-20px rd-16px bg-primary/5 border border-primary/10">
            <h4 class="text-16px font-bold text-primary mb-12px flex items-center gap-8px">
              <SvgIcon icon="ph:info-duotone" />
              监听数据
            </h4>
            <div class="space-y-12px font-mono text-13px">
              <div class="flex justify-between">
                <span class="text-slate-400">Position:</span>
                <span class="text-primary font-bold">{{ scrollStats.position.toFixed(1) }}px</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Percentage:</span>
                <span class="text-primary font-bold">{{ scrollStats.percentage.toFixed(1) }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Direction:</span>
                <span class="text-primary font-bold capitalize">{{ scrollStats.direction }}</span>
              </div>
            </div>
          </div>

          <div class="p-20px rd-16px bg-amber-500/5 border border-amber-500/10">
            <h4 class="text-16px font-bold text-amber-600 mb-8px">使用说明</h4>
            <p class="text-13px text-amber-700/80 leading-relaxed">
              `v-scroll` 指令接收一个回调函数，每当容器发生滚动时，它会提供包含位置、百分比、方向和速度的实时数据对象。
            </p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础滚动监听 --&gt;
&lt;div v-scroll="handleScroll"&gt;...&lt;/div&gt;

// 回调数据结构
const handleScroll = ({ position, percentage, direction, velocity }) => {
  console.log('当前滚动百分比:', percentage)
}</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.scroll-demo-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-demo-container::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-color-rgb), 0.1);
  border-radius: 3px;
}
.scroll-demo-container::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--primary-color-rgb), 0.2);
}
</style>

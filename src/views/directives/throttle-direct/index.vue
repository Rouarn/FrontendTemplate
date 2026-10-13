<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'DirectivesThrottleDirect',
})

const clickCount = ref(0)
const executeCount = ref(0)
const scrollCount = ref(0)
const scrollExecuteCount = ref(0)

const handleBtnClick = () => {
  executeCount.value++
  window.$message?.success(`节流执行成功！累计执行 ${executeCount.value} 次`)
}

const handleScroll = () => {
  scrollExecuteCount.value++
}

const handleTrigger = () => {
  clickCount.value++
}

const handleScrollTrigger = () => {
  scrollCount.value++
}

const reset = () => {
  clickCount.value = 0
  executeCount.value = 0
  scrollCount.value = 0
  scrollExecuteCount.value = 0
}

/** 代码实现示例 */
const usageCode = `<!-- 基础用法 (默认 1000ms) -->
<NButton v-throttle="handleClick">点击</NButton>

<!-- 自定义间隔时间 -->
<NButton v-throttle="{ fn: handleClick, delay: 2000 }">间隔 2s</NButton>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Page Header -->
    <PageHeader
      icon="ph:hourglass-medium-duotone"
      title="节流指令 `v-throttle`"
      description="每隔一定时间最多执行一次。无论触发频率多高，都会按固定的时间间隔执行。"
    />

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-24px font-bold text-primary tabular-nums">{{ clickCount }}</div>
        <div class="text-12px text-slate-500 font-medium">按钮累计点击</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-24px font-bold text-success tabular-nums">{{ executeCount }}</div>
        <div class="text-12px text-slate-500 font-medium">按钮节流执行</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-24px font-bold text-primary tabular-nums">{{ scrollCount }}</div>
        <div class="text-12px text-slate-500 font-medium">滚动累计触发</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-24px font-bold text-success tabular-nums">{{ scrollExecuteCount }}</div>
        <div class="text-12px text-slate-500 font-medium">滚动节流执行</div>
      </NCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16px">
      <!-- Button Throttle -->
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:hand-tap-duotone" class="text-21px text-primary" />
            按钮点击节流
          </span>
        </template>
        <div class="flex-col gap-20px py-12px h-full">
          <p class="text-14px text-slate-500">疯狂点击下方按钮，每 1000ms 才会执行一次逻辑，防止重复提交。</p>
          <div class="flex-center flex-1">
            <NButton
              v-throttle="{ fn: handleBtnClick, delay: 1000 }"
              type="primary"
              class="h-56px rd-16px px-40px text-18px font-bold shadow-low transition-all duration-300 active:scale-95"
              @click="handleTrigger"
            >
              <template #icon>
                <SvgIcon icon="ph:hand-tap-duotone" />
              </template>
              疯狂快速点击
            </NButton>
          </div>
          <div class="text-center">
            <NButton quaternary @click="reset">
              <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
              重置所有数据
            </NButton>
          </div>
        </div>
      </NCard>

      <!-- Scroll Throttle -->
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:scroll-duotone" class="text-21px text-primary" />
            滚动事件节流
          </span>
        </template>
        <div class="flex-col gap-20px py-12px">
          <p class="text-14px text-slate-500">在下方区域滚动，通过节流将高频滚动事件降低到 200ms 执行一次。</p>
          <div
            class="h-200px overflow-y-auto rd-12px bg-layout border border-primary/10 p-16px"
            v-throttle="{ fn: handleScroll, delay: 200, event: 'scroll' }"
            @scroll="handleScrollTrigger"
          >
            <div class="space-y-12px">
              <div v-for="i in 20" :key="i" class="h-40px bg-primary/5 rd-8px flex-y-center px-16px text-14px text-slate-400">
                滚动内容项 {{ i }}
              </div>
            </div>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Comparison Table -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:table-duotone" class="text-21px text-blue-500" />
          防抖与节流对比
        </span>
      </template>
      <NTable :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th class="w-100px">特性</th>
            <th>防抖 (Debounce)</th>
            <th>节流 (Throttle)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-bold text-primary">执行时机</td>
            <td>事件停止触发后 delay 时间才执行</td>
            <td>每隔 delay 时间最多执行一次</td>
          </tr>
          <tr>
            <td class="font-bold text-primary">核心原理</td>
            <td>重新计时 (Reset Timer)</td>
            <td>时间戳比对或预约执行</td>
          </tr>
          <tr>
            <td class="font-bold text-primary">适用场景</td>
            <td>搜索联想、窗口 Resize 调整、表单校验</td>
            <td>滚动加载、高频点击提交、鼠标移动监听</td>
          </tr>
        </tbody>
      </NTable>
    </NCard>

    <!-- Guide -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

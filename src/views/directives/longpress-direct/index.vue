<script setup lang="ts" name="longpressDirect">
import { ref } from 'vue'

const longpressCount = ref(0)
const isPressing = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const onLongpress = () => {
  longpressCount.value++
  isPressing.value = false
  progress.value = 0
  window.$message?.success(`长按触发成功！第 ${longpressCount.value} 次 ✨`)
}

const startPress = () => {
  isPressing.value = true
  progress.value = 0
  timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2
    } else if (timer) {
      clearInterval(timer)
      timer = null
    }
  }, 20)
}

const endPress = () => {
  isPressing.value = false
  progress.value = 0
  if (timer) clearInterval(timer)
}

const resetCounter = () => {
  longpressCount.value = 0
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:fingerprint-simple-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">长按指令 `v-longpress`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            检测并响应长时间按压操作，支持自定义时长，有效防止误触并丰富交互反馈
          </p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ longpressCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计成功长按次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-blue-500 tabular-nums">{{ progress }}%</div>
        <div class="text-14px text-slate-500 font-medium">当前按压进度</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper flex-center">
        <div class="flex items-center gap-8px">
          <div v-if="isPressing" class="size-10px rd-full bg-success animate-ping" />
          <span class="text-16px font-bold" :class="isPressing ? 'text-success' : 'text-slate-400'">{{
            isPressing ? '按压中...' : '待机'
          }}</span>
        </div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard title="👆 长按交互演示" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <NButton quaternary @click="resetCounter">
          <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
          重置统计数据
        </NButton>
      </template>

      <div class="flex-col-center py-48px bg-layout/50 rd-24px border-2 border-dashed border-primary/10">
        <div class="relative flex-col-center gap-24px">
          <NButton
            v-longpress="onLongpress"
            type="primary"
            class="h-64px rd-20px px-40px text-20px font-bold shadow-low transition-all duration-200 active:scale-95"
            @mousedown="startPress"
            @mouseup="endPress"
            @mouseleave="endPress"
            @touchstart="startPress"
            @touchend="endPress"
          >
            <template #icon>
              <SvgIcon icon="ph:hand-tap-duotone" />
            </template>
            按住我 1 秒
          </NButton>

          <!-- Progress Ring/Bar -->
          <div class="w-240px">
            <NProgress type="line" :percentage="progress" :show-indicator="false" status="success" :height="8" class="rd-full" />
            <p class="mt-12px text-center text-13px text-slate-400">
              {{ isPressing ? '继续保持，不要松手...' : '松手即刻重置进度' }}
            </p>
          </div>
        </div>

        <div class="mt-48px grid grid-cols-1 md:grid-cols-2 gap-16px w-full max-w-600px px-24px">
          <div class="p-16px rd-16px bg-primary/5 border border-primary/10 flex items-start gap-12px">
            <SvgIcon icon="ph:shield-check-duotone" class="text-20px text-primary mt-2px" />
            <p class="text-13px text-slate-600 leading-relaxed">防止误操作，常用于删除、重置等敏感功能的二次确认。</p>
          </div>
          <div class="p-16px rd-16px bg-amber-500/5 border border-amber-500/10 flex items-start gap-12px">
            <SvgIcon icon="ph:device-mobile-duotone" class="text-20px text-amber-600 mt-2px" />
            <p class="text-13px text-slate-600 leading-relaxed">移动端友好，支持触屏长按事件监听。</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 (默认 1000ms) --&gt;
&lt;NButton v-longpress="handleLongpress"&gt;长按触发&lt;/NButton&gt;

&lt;!-- 自定义时长 --&gt;
&lt;NButton v-longpress="{ fn: handleLongpress, delay: 2000 }"&gt;长按 2 秒&lt;/NButton&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

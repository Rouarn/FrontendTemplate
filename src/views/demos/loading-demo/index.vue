<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'LoadingDemo',
})

const requestLoading = ref(false)

// 模拟基础加载
function handleBasicLoading() {
  if (window.$loading) {
    window.$loading.open()
    setTimeout(() => {
      window.$loading?.close()
    }, 2000)
  }
}

// 模拟自定义文本加载
function handleCustomTextLoading() {
  if (window.$loading) {
    window.$loading.setText('正在处理数据...')
    window.$loading.open()
    setTimeout(() => {
      window.$loading?.setText('加载中...')
      window.$loading?.close()
    }, 3000)
  }
}

// 模拟HTTP请求加载
function handleRequestLoading() {
  requestLoading.value = true

  // 模拟HTTP请求
  setTimeout(() => {
    requestLoading.value = false
    window.$message?.success('请求完成！')
  }, 2500)
}

// 模拟多次调用
function handleMultipleLoading() {
  if (window.$loading) {
    // 模拟多个并发请求
    window.$loading.open() // 第一个请求
    window.$loading.open() // 第二个请求
    window.$loading.open() // 第三个请求

    setTimeout(() => window.$loading?.close(), 1000) // 第一个请求完成
    setTimeout(() => window.$loading?.close(), 1500) // 第二个请求完成
    setTimeout(() => window.$loading?.close(), 2000) // 第三个请求完成
  }
}

// 检查加载状态
function checkLoadingStatus() {
  if (window.$loading) {
    const status = window.$loading.isLoading()
    window.$message?.info(`当前加载状态: ${status ? '加载中' : '空闲'}`)
  }
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:spinner-gap-duotone" class="text-40px animate-spin" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">现代化 Loading 组件</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">适用于全局或局部加载状态的优雅交互方案，支持智能计数与文本自定义</p>
        </div>
      </div>
    </NCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px">
      <!-- 基础用法 -->
      <NCard title="🚀 基础用法" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">最简单的调用方式，显示全局加载动画，2秒后自动关闭</p>
          <NButton
            @click="handleBasicLoading"
            type="primary"
            size="large"
            class="rd-8px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
          >
            <template #icon><SvgIcon icon="ph:play-duotone" /></template>
            显示基础加载
          </NButton>
        </div>
      </NCard>

      <!-- 自定义文本 -->
      <NCard title="📝 自定义文本" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">动态更新加载提示文字内容，为用户提供更清晰的反馈</p>
          <NButton
            @click="handleCustomTextLoading"
            type="info"
            secondary
            strong
            size="large"
            class="rd-8px font-bold transition-all duration-300 active:scale-95"
          >
            <template #icon><SvgIcon icon="ph:text-t-duotone" /></template>
            显示自定义文本加载
          </NButton>
        </div>
      </NCard>

      <!-- 状态检查 -->
      <NCard title="🔍 状态检查" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">实时获取当前 Loading 服务的运行状态，辅助业务逻辑判断</p>
          <NButton @click="checkLoadingStatus" quaternary size="large" class="rd-8px font-bold transition-all duration-300 active:scale-95">
            <template #icon><SvgIcon icon="ph:magnifying-glass-duotone" /></template>
            检查当前状态
          </NButton>
        </div>
      </NCard>

      <!-- 多重调用 -->
      <NCard title="🔄 多重调用" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">模拟并发场景，确保 Loading 正确管理计数，所有请求结束后再隐藏</p>
          <NButton
            @click="handleMultipleLoading"
            type="warning"
            secondary
            strong
            size="large"
            class="rd-8px font-bold transition-all duration-300 active:scale-95"
          >
            <template #icon><SvgIcon icon="ph:stack-duotone" /></template>
            触发多重加载
          </NButton>
        </div>
      </NCard>

      <!-- HTTP 请求模拟 -->
      <NCard title="🌐 HTTP 请求模拟" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">模拟真实的 HTTP 请求场景，展示在请求期间的局部加载效果</p>
          <NButton
            @click="handleRequestLoading"
            type="success"
            secondary
            strong
            size="large"
            class="rd-8px font-bold transition-all duration-300 active:scale-95"
            :loading="requestLoading"
          >
            <template #icon><SvgIcon icon="ph:globe-duotone" /></template>
            {{ requestLoading ? '请求中...' : '发送 HTTP 请求' }}
          </NButton>
        </div>
      </NCard>
    </div>

    <!-- Features -->
    <NCard title="✨ 核心特性" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24px">
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-primary/10 text-primary rd-10px flex-shrink-0">
            <SvgIcon icon="ph:hash-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">智能计数</h4>
            <p class="text-13px text-slate-500 mt-4px">支持多次并行调用，自动管理显示状态</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-blue-500/10 text-blue-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:lightning-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">极致性能</h4>
            <p class="text-13px text-slate-500 mt-4px">最小显示时间控制，杜绝界面闪烁</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-amber-500/10 text-amber-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:paint-brush-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">现代美学</h4>
            <p class="text-13px text-slate-500 mt-4px">磨砂玻璃质感，配合顺滑过渡动效</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-purple-500/10 text-purple-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:devices-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">全端适配</h4>
            <p class="text-13px text-slate-500 mt-4px">响应式布局设计，完美契合多端尺寸</p>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

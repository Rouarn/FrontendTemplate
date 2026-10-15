<script setup lang="ts">
import { markRaw, reactive, ref } from 'vue'

defineOptions({
  name: 'DirectivesMaskDirect',
})

const showBasicMask = ref(false)

// 遮罩富文本内容统一用 DOM 节点插入，规避 innerHTML 的 XSS 风险
// markRaw 防止响应式代理破坏 DOM 节点的品牌检查（appendChild 会报错）
// 加载动效使用纯 CSS 边框旋转，颜色取主题主色，避免依赖运行时图标请求
const loadingWrapper = document.createElement('div')
loadingWrapper.className = 'flex-col-center gap-14px'
const spinner = document.createElement('div')
spinner.className =
  'size-42px rd-full border-3px border-solid border-white/20 border-t-primary animate-spin'
const loadingText = document.createElement('div')
loadingText.className = 'text-15px font-bold text-white tracking-2px'
loadingText.textContent = '加载中...'
loadingWrapper.append(spinner, loadingText)

const clickableContent = document.createElement('div')
clickableContent.className =
  'flex items-center gap-10px px-22px py-14px bg-container rd-12px shadow-high text-14px font-bold text-base-text'
const clickableDot = document.createElement('div')
clickableDot.className = 'size-8px rd-full bg-primary flex-shrink-0 animate-pulse'
const clickableText = document.createElement('span')
clickableText.textContent = '点击背景区域即可关闭'
clickableContent.append(clickableDot, clickableText)

const maskWithContent = reactive({
  visible: false,
  content: markRaw(loadingWrapper),
  background: 'rgba(0, 0, 0, 0.7)',
})

const clickableMask = reactive({
  visible: false,
  content: markRaw(clickableContent),
  clickToClose: true,
  background: 'rgba(0, 0, 0, 0.6)',
})

const handleMaskClose = (event: CustomEvent) => {
  if (event.detail?.reason === 'click') {
    clickableMask.visible = false
  }
}

/** 使用指南示例代码 */
const usageCode = `<!-- 基础用法 -->
<div v-mask="isVisible">...</div>

<!-- 纯文本内容（按文本渲染，防 XSS） -->
<div v-mask="{
  visible: true,
  content: '加载中...',
  background: 'rgba(0,0,0,0.5)'
}">...</div>

<!-- 富文本内容：传入 HTMLElement 节点 -->
<div v-mask="{ visible: true, content: domNode }">...</div>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- 页头 -->
    <PageHeader
      icon="ph:mask-happy-duotone"
      title="遮罩指令 `v-mask`"
      description="为特定容器快速生成覆盖层，支持自定义 DOM 内容、点击外部关闭与精细化样式控制"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px">
      <!-- 基础遮罩 -->
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:mask-happy-duotone" class="text-21px text-primary" />
            基础遮罩
          </span>
        </template>
        <div class="flex-col gap-16px">
          <div
            v-mask="showBasicMask"
            class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden"
          >
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">受保护的内容区</h3>
              <p class="text-14px text-slate-400">点击下方按钮启用基础遮罩覆盖此区域</p>
            </div>
          </div>
          <NButton
            @click="showBasicMask = !showBasicMask"
            type="primary"
            block
            secondary
            strong
            size="large"
            class="rd-10px"
          >
            {{ showBasicMask ? '隐藏遮罩' : '显示基础遮罩' }}
          </NButton>
        </div>
      </NCard>

      <!-- 内容遮罩 -->
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:pencil-line-duotone" class="text-21px text-primary" />
            增强内容遮罩
          </span>
        </template>
        <div class="flex-col gap-16px">
          <div
            v-mask="{ ...maskWithContent }"
            class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden"
          >
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">异步加载模拟</h3>
              <p class="text-14px text-slate-400">支持在遮罩中插入自定义 DOM 内容与图标动效</p>
            </div>
          </div>
          <NButton
            @click="maskWithContent.visible = !maskWithContent.visible"
            type="info"
            block
            secondary
            strong
            size="large"
            class="rd-10px"
          >
            {{ maskWithContent.visible ? '隐藏遮罩' : '显示带内容遮罩' }}
          </NButton>
        </div>
      </NCard>

      <!-- 交互遮罩 -->
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:cursor-click-duotone" class="text-21px text-primary" />
            交互式关闭
          </span>
        </template>
        <div class="flex-col gap-16px">
          <div
            v-mask="{ ...clickableMask }"
            @mask-close="handleMaskClose"
            class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden"
          >
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">点击背景关闭</h3>
              <p class="text-14px text-slate-400">启用 `clickToClose` 配置，方便用户快速退出</p>
            </div>
          </div>
          <NButton
            @click="clickableMask.visible = true"
            type="success"
            block
            secondary
            strong
            size="large"
            class="rd-10px"
          >
            触发交互遮罩
          </NButton>
        </div>
      </NCard>

      <!-- 代码示例 -->
      <CodeBlock title="代码示例" :code="usageCode" />
    </div>
  </div>
</template>

<style scoped></style>

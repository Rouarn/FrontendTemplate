<script setup lang="ts" name="maskDirect">
import { reactive, ref } from 'vue'

const showBasicMask = ref(false)

const maskWithContent = reactive({
  visible: false,
  content:
    '<div class="flex-col-center gap-12px"><div class="i-ph:spinner-gap-duotone text-40px animate-spin text-white"></div><div class="text-white font-bold">加载中...</div></div>',
  background: 'rgba(0, 0, 0, 0.7)',
})

const clickableMask = reactive({
  visible: false,
  content: '<div class="px-24px py-16px bg-container rd-12px shadow-high text-base-text font-bold">点击背景区域即可关闭</div>',
  clickToClose: true,
  background: 'rgba(0, 0, 0, 0.6)',
})

const handleMaskClose = (event: CustomEvent) => {
  if (event.detail?.reason === 'click') {
    clickableMask.visible = false
  }
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:mask-happy-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">遮罩指令 `v-mask`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            为特定容器快速生成覆盖层，支持 HTML 自定义内容、点击外部关闭与精细化样式控制
          </p>
        </div>
      </div>
    </NCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px">
      <!-- Basic Mask -->
      <NCard title="🎭 基础遮罩" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div v-mask="showBasicMask" class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden">
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">受保护的内容区</h3>
              <p class="text-14px text-slate-400">点击下方按钮启用基础遮罩覆盖此区域</p>
            </div>
          </div>
          <NButton @click="showBasicMask = !showBasicMask" type="primary" block secondary strong size="large" class="rd-10px">
            {{ showBasicMask ? '隐藏遮罩' : '显示基础遮罩' }}
          </NButton>
        </div>
      </NCard>

      <!-- Content Mask -->
      <NCard title="📝 增强内容遮罩" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div v-mask="maskWithContent" class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden">
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">异步加载模拟</h3>
              <p class="text-14px text-slate-400">支持在遮罩中插入自定义 HTML 与图标动效</p>
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

      <!-- Interactive Mask -->
      <NCard title="👆 交互式关闭" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div
            v-mask="clickableMask"
            @mask-close="handleMaskClose"
            class="relative h-200px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden"
          >
            <div class="text-center p-20px">
              <h3 class="text-18px font-bold text-base-text mb-8px">点击背景关闭</h3>
              <p class="text-14px text-slate-400">启用 `clickToClose` 配置，方便用户快速退出</p>
            </div>
          </div>
          <NButton @click="clickableMask.visible = true" type="success" block secondary strong size="large" class="rd-10px">
            触发交互遮罩
          </NButton>
        </div>
      </NCard>

      <!-- Code Example -->
      <NCard title="💡 代码示例" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="h-full flex-col justify-center">
          <div class="p-16px rd-12px bg-layout border border-primary/10">
            <pre class="text-13px font-mono text-primary leading-relaxed"><code>&lt;!-- 基础用法 --&gt;
&lt;div v-mask="isVisible"&gt;...&lt;/div&gt;

&lt;!-- 高级用法 --&gt;
&lt;div v-mask="{
  visible: true,
  content: '&lt;span&gt;Loading&lt;/span&gt;',
  background: 'rgba(0,0,0,0.5)'
}"&gt;...&lt;/div&gt;</code></pre>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>

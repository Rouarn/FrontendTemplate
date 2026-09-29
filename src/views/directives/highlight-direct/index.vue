<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'highlightDirect',
})

const searchText = ref('Vue')
const highlightColor = ref('#059669')
const textContent = ref(`Vue.js 是一个用于构建用户界面的渐进式 JavaScript 框架。
与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。
Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。
另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。`)

const presetColors = [
  { name: '清新绿', value: '#059669' },
  { name: '经典黄', value: '#ffeb3b' },
  { name: '柔和蓝', value: '#3b82f6' },
  { name: '活力橙', value: '#f59e0b' },
  { name: '警示红', value: '#ef4444' },
]

/** 使用指南示例代码 */
const usageCode = `<!-- 基础用法 -->
<div v-highlight="'关键词'">...</div>

<!-- 自定义配置 -->
<div v-highlight="{ 
  keywords: 'Vue', 
  colors: '#059669', 
  textColor: '#fff' 
}">...</div>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Page Header -->
    <PageHeader
      icon="ph:highlighter-circle-duotone"
      title="高亮指令 `v-highlight`"
      description="智能识别并高亮文本中的关键词，支持动态搜索、颜色定制与多种高亮样式"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-16px">
      <!-- Controls -->
      <NCard :bordered="false" class="card-wrapper lg:col-span-1" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:sliders-horizontal-duotone" class="text-21px text-primary" />
            配置中心
          </span>
        </template>
        <div class="flex-col gap-24px">
          <div class="space-y-8px">
            <label class="text-14px font-bold text-base-text">搜索关键词</label>
            <NInput v-model:value="searchText" placeholder="输入要高亮的文字..." class="rd-12px" clearable />
          </div>

          <div class="space-y-12px">
            <label class="text-14px font-bold text-base-text">高亮颜色</label>
            <div class="flex flex-wrap gap-12px">
              <div
                v-for="color in presetColors"
                :key="color.value"
                class="size-32px rd-full cursor-pointer transition-all duration-300 border-2 flex-center"
                :style="{ backgroundColor: color.value, borderColor: highlightColor === color.value ? 'rgba(0,0,0,0.1)' : 'transparent' }"
                :title="color.name"
                @click="highlightColor = color.value"
              >
                <SvgIcon v-if="highlightColor === color.value" icon="ph:check-bold" class="text-white text-14px" />
              </div>
              <NColorPicker v-model:value="highlightColor" :show-alpha="false" size="small" class="w-100px rd-8px" />
            </div>
          </div>

          <div class="p-16px rd-16px bg-primary/5 border border-primary/10">
            <h4 class="text-14px font-bold text-primary mb-8px flex items-center gap-6px">
              <SvgIcon icon="ph:lightbulb-duotone" />
              使用提示
            </h4>
            <p class="text-12px text-slate-500 leading-relaxed">
              指令会自动处理文本节点，支持不区分大小写的全局匹配。当关键词为空时，会自动清除所有高亮标记。
            </p>
          </div>
        </div>
      </NCard>

      <!-- Preview Area -->
      <NCard :bordered="false" class="card-wrapper lg:col-span-2" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:eye-duotone" class="text-21px text-primary" />
            实时预览
          </span>
        </template>
        <div class="p-24px rd-20px bg-layout border border-primary/5 min-h-300px">
          <div
            v-highlight="{ keywords: searchText, colors: highlightColor }"
            class="text-16px text-slate-600 leading-relaxed whitespace-pre-wrap"
          >
            {{ textContent }}
          </div>
        </div>

        <div class="mt-24px grid grid-cols-1 md:grid-cols-2 gap-16px">
          <div class="p-16px rd-16px bg-container border border-layout shadow-low">
            <h5 class="text-14px font-bold text-base-text mb-12px flex items-center gap-8px">
              <div class="size-6px rd-full bg-primary" />
              默认高亮 (Vue)
            </h5>
            <div v-highlight="'Vue'" class="text-13px text-slate-500">Vue 让前端开发变得前所未有的简单与高效。</div>
          </div>
          <div class="p-16px rd-16px bg-container border border-layout shadow-low">
            <h5 class="text-14px font-bold text-base-text mb-12px flex items-center gap-8px">
              <div class="size-6px rd-full bg-amber-500" />
              边框样式 (框架)
            </h5>
            <div v-highlight="{ keywords: '框架', style: 'border', colors: '#f59e0b' }" class="text-13px text-slate-500">
              在众多前端框架中，Vue 凭借其优雅的 API 脱颖而出。
            </div>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Guide -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

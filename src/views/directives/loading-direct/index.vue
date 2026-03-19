<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'loadingDirect',
})

const isLoading = ref(false)
const isTableLoading = ref(false)

const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

const toggleTableLoading = () => {
  isTableLoading.value = true
  setTimeout(() => {
    isTableLoading.value = false
  }, 1500)
}

const tableData = [
  { id: 1, name: '张三', role: '管理员', status: '在线' },
  { id: 2, name: '李四', role: '开发者', status: '忙碌' },
  { id: 3, name: '王五', role: '测试员', status: '离线' },
  { id: 4, name: '赵六', role: '用户', status: '在线' },
]

const tableColumns = [
  { title: 'ID', key: 'id', width: 60 },
  { title: '姓名', key: 'name' },
  { title: '角色', key: 'role' },
  { title: '状态', key: 'status' },
]
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:spinner-duotone" class="text-40px animate-spin" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">加载指令 `v-loading`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            为任意容器添加局部加载遮罩，支持自定义文本、图标与背景色，提供丝滑的加载过渡体验
          </p>
        </div>
      </div>
    </NCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16px">
      <!-- Basic Usage -->
      <NCard title="🔄 基础加载" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div v-loading="isLoading" class="relative h-240px rd-16px bg-layout border border-primary/5 flex-center overflow-hidden">
            <div class="text-center p-24px">
              <SvgIcon icon="ph:files-duotone" class="text-48px text-primary/20 mb-12px mx-auto" />
              <h3 class="text-18px font-bold text-base-text mb-8px">数据展示区域</h3>
              <p class="text-14px text-slate-400">点击下方按钮模拟数据请求过程中的加载状态</p>
            </div>
          </div>
          <NButton @click="toggleLoading" type="primary" block secondary strong size="large" class="rd-10px">
            {{ isLoading ? '正在加载数据...' : '触发局部加载' }}
          </NButton>
        </div>
      </NCard>

      <!-- Table Loading -->
      <NCard title="📊 表格集成" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <div
            v-loading="{ loading: isTableLoading, text: '同步中...', background: 'rgba(255,255,255,0.8)' }"
            class="rd-16px border border-layout overflow-hidden"
          >
            <NDataTable :columns="tableColumns" :data="tableData" :bordered="false" />
          </div>
          <NButton @click="toggleTableLoading" type="success" block secondary strong size="large" class="rd-10px">
            {{ isTableLoading ? '刷新中...' : '刷新表格数据' }}
          </NButton>
        </div>
      </NCard>
    </div>

    <!-- Features -->
    <NCard title="✨ 核心特性" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-24px">
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-primary/10 text-primary rd-10px flex-shrink-0">
            <SvgIcon icon="ph:intersect-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">容器自适应</h4>
            <p class="text-13px text-slate-500 mt-4px">自动识别父容器尺寸，实现精准的全覆盖遮罩效果</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-blue-500/10 text-blue-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:paint-brush-household-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">样式定制</h4>
            <p class="text-13px text-slate-500 mt-4px">支持自定义遮罩背景色、加载文字以及图标样式</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-amber-500/10 text-amber-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:ghost-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">智能防闪烁</h4>
            <p class="text-13px text-slate-500 mt-4px">内置最小显示时长控制，避免极快请求导致的界面闪烁</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 --&gt;
&lt;div v-loading="isLoading"&gt;...&lt;/div&gt;

&lt;!-- 高级配置 --&gt;
&lt;div v-loading="{ 
  loading: true, 
  text: '加载中...', 
  background: 'rgba(0,0,0,0.6)' 
}"&gt;...&lt;/div&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

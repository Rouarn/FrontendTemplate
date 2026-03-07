<script setup lang="ts" name="debounceDirect">
import { ref } from 'vue'

const clickCount = ref(0)
const executeCount = ref(0)
const searchText = ref('')
const searchResult = ref<string[]>([])

// 模拟搜索请求
const handleSearch = () => {
  if (!searchText.value.trim()) {
    searchResult.value = []
    return
  }
  // 模拟搜索建议
  searchResult.value = [`结果: ${searchText.value} 1`, `结果: ${searchText.value} 2`, `结果: ${searchText.value} 3`]
  window.$message?.info(`搜索请求已发送: ${searchText.value}`)
}

const handleBtnClick = () => {
  executeCount.value++
  window.$message?.success(`防抖执行成功！累计执行 ${executeCount.value} 次`)
}

const handleTrigger = () => {
  clickCount.value++
}

const reset = () => {
  clickCount.value = 0
  executeCount.value = 0
  searchText.value = ''
  searchResult.value = []
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:timer-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">防抖指令 `v-debounce`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            在事件停止触发后延迟一定时间再执行。如果在延迟时间内再次触发，则重新计时。
          </p>
        </div>
      </div>
    </NCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ clickCount }}</div>
        <div class="text-14px text-slate-500 font-medium">累计触发次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-success tabular-nums">{{ executeCount }}</div>
        <div class="text-14px text-slate-500 font-medium">实际执行次数</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-amber-500 tabular-nums">{{ Math.max(0, clickCount - executeCount) }}</div>
        <div class="text-14px text-slate-500 font-medium">节省执行次数</div>
      </NCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16px">
      <!-- Trailing Debounce (Search) -->
      <NCard title="🔍 搜索场景 (延迟执行)" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-20px py-12px">
          <p class="text-14px text-slate-500">停止输入 500ms 后才触发搜索请求，避免每输入一个字符都发请求。</p>
          <NInput
            v-model:value="searchText"
            v-debounce="{ fn: handleSearch, delay: 500, event: 'input' }"
            placeholder="请输入搜索内容..."
            size="large"
            class="rd-12px"
            @input="handleTrigger"
          >
            <template #prefix>
              <SvgIcon icon="ph:magnifying-glass-duotone" class="text-20px text-primary/40" />
            </template>
          </NInput>
          <div v-if="searchResult.length > 0" class="p-12px bg-layout rd-12px border border-primary/10">
            <div v-for="res in searchResult" :key="res" class="py-4px text-14px text-slate-600 border-b border-layout last:border-none">
              {{ res }}
            </div>
          </div>
        </div>
      </NCard>

      <!-- Leading Debounce (Button) -->
      <NCard title="⚡ 按钮场景 (立即执行)" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-20px py-12px h-full">
          <p class="text-14px text-slate-500">点击后立即响应，但 1000ms 内重复点击无效。保证首发响应，后续拦截。</p>
          <div class="flex-center flex-1">
            <NButton
              v-debounce="{ fn: handleBtnClick, delay: 1000, immediate: true }"
              type="primary"
              class="h-56px rd-16px px-40px text-18px font-bold shadow-low transition-all duration-300 active:scale-95"
              @click="handleTrigger"
            >
              <template #icon>
                <SvgIcon icon="ph:lightning-duotone" />
              </template>
              立即防抖点击
            </NButton>
          </div>
          <div class="text-center">
            <NButton quaternary @click="reset">
              <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
              重置统计数据
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 (默认 500ms 延迟) --&gt;
&lt;NButton v-debounce="handleClick"&gt;点击&lt;/NButton&gt;

&lt;!-- 进阶配置 (立即执行) --&gt;
&lt;NButton v-debounce="{ 
  fn: handleClick, 
  delay: 1000, 
  immediate: true 
}"&gt;立即响应&lt;/NButton&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'lazyDirect',
})

const imageList = ref([
  { id: 1, src: 'https://picsum.photos/400/300?random=1', alt: '自然风光 1' },
  { id: 2, src: 'https://picsum.photos/400/300?random=2', alt: '自然风光 2' },
  { id: 3, src: 'https://picsum.photos/400/300?random=3', alt: '自然风光 3' },
  { id: 4, src: 'https://picsum.photos/400/300?random=4', alt: '自然风光 4' },
  { id: 5, src: 'https://picsum.photos/400/300?random=5', alt: '自然风光 5' },
  { id: 6, src: 'https://picsum.photos/400/300?random=6', alt: '自然风光 6' },
])

const loadedCount = ref(0)
const onImageLoad = () => {
  loadedCount.value++
}

/** 使用指南示例代码 */
const usageCode = `<!-- 基础用法 -->
<img v-lazy="'/path/to/image.jpg'" />

<!-- 高级用法 -->
<img v-lazy="{ 
  src: '/real/image.jpg', 
  placeholder: '/placeholder.jpg',
  error: '/error.jpg' 
}" />`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Page Header -->
    <PageHeader
      icon="ph:image-duotone"
      title="懒加载指令 `v-lazy`"
      description="图片进入可视区域时才触发加载，显著降低首屏流量消耗并提升页面加载速度"
    />

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-primary tabular-nums">{{ loadedCount }} / {{ imageList.length }}</div>
        <div class="text-14px text-slate-500 font-medium">已加载图片统计</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper flex-center">
        <div class="w-full px-24px">
          <NProgress
            type="line"
            :percentage="Math.round((loadedCount / imageList.length) * 100)"
            :show-indicator="true"
            indicator-placement="inside"
            processing
            class="h-24px rd-12px"
          />
        </div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:images-duotone" class="text-21px text-primary" />
          滚动加载演示
        </span>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24px py-16px">
        <div
          v-for="image in imageList"
          :key="image.id"
          class="group relative aspect-video rd-20px overflow-hidden bg-layout border border-primary/5 shadow-low hover:shadow-high transition-all duration-500"
        >
          <img
            v-lazy="{
              src: image.src,
              placeholder: 'https://via.placeholder.com/400x300/f8fafc/94a3b8?text=Loading...',
              error: 'https://via.placeholder.com/400x300/fef2f2/ef4444?text=Load+Error',
            }"
            :alt="image.alt"
            class="size-full object-cover transition-transform duration-700 group-hover:scale-110"
            @load="onImageLoad"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-16px"
          >
            <div class="text-white">
              <h4 class="text-16px font-bold">{{ image.alt }}</h4>
              <p class="text-12px text-white/70">ID: {{ image.id }} · Intersection Observer</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Features -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:star-duotone" class="text-21px text-amber-500" />
          核心特性
        </span>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-24px">
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-primary/10 text-primary rd-10px flex-shrink-0">
            <SvgIcon icon="ph:lightning-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">高性能</h4>
            <p class="text-13px text-slate-500 mt-4px">基于原生 IntersectionObserver API，极低系统开销</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-blue-500/10 text-blue-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:image-square-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">占位图支持</h4>
            <p class="text-13px text-slate-500 mt-4px">支持加载前占位图与加载失败后的错误图替换</p>
          </div>
        </div>
        <div class="flex items-start gap-16px">
          <div class="size-40px flex-center bg-amber-500/10 text-amber-500 rd-10px flex-shrink-0">
            <SvgIcon icon="ph:intersect-duotone" class="text-20px" />
          </div>
          <div>
            <h4 class="text-16px font-bold text-base-text">智能识别</h4>
            <p class="text-13px text-slate-500 mt-4px">自动处理容器滚动与页面缩放导致的视口变化</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Guide -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped></style>

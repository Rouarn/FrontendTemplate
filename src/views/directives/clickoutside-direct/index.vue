<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'clickoutsideDirect',
})

const isDropdownOpen = ref(false)
const clickCount = ref(0)

const handleClickOutside = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
    clickCount.value++
    window.$message?.info('点击了外部区域，菜单已关闭')
  }
}

const toggleDropdown = (event: Event) => {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleMenuItemClick = (itemName: string) => {
  window.$message?.success(`点击了：${itemName}`)
  isDropdownOpen.value = false
}

/** 代码实现示例 */
const usageCode = `<!-- 在需要监听外部点击的元素上使用 -->
<div v-if="visible" v-clickoutside="handleClose">
  我是菜单内容
</div>`
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Page Header -->
    <PageHeader
      icon="ph:cursor-click-duotone"
      title="点击外部指令 `v-clickoutside`"
      description="检测点击元素外部区域的事件，常用于关闭下拉菜单、模态框或气泡提示"
    />

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-16px">
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="flex-center gap-12px">
          <div class="size-12px rd-full animate-pulse" :class="isDropdownOpen ? 'bg-success' : 'bg-slate-300'" />
          <div class="text-32px font-bold text-primary tabular-nums">{{ isDropdownOpen ? '已打开' : '已关闭' }}</div>
        </div>
        <div class="text-14px text-slate-500 font-medium">菜单当前状态</div>
      </NCard>
      <NCard :bordered="false" class="card-wrapper text-center">
        <div class="text-32px font-bold text-blue-500 tabular-nums">{{ clickCount }}</div>
        <div class="text-14px text-slate-500 font-medium">外部点击触发次数</div>
      </NCard>
    </div>

    <!-- Playground -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:target-duotone" class="text-21px text-primary" />
          交互演示
        </span>
      </template>
      <div class="flex-col-center py-64px bg-layout/50 rd-24px border-2 border-dashed border-primary/10">
        <div class="relative">
          <NButton
            type="primary"
            size="large"
            class="rd-12px px-32px font-bold shadow-low transition-all duration-300 active:scale-95"
            @click="toggleDropdown"
          >
            <template #icon>
              <SvgIcon icon="ph:list-bold" class="transition-transform duration-300" :class="{ 'rotate-90': isDropdownOpen }" />
            </template>
            点击切换菜单
          </NButton>

          <!-- Dropdown Menu -->
          <Transition name="fade-scale">
            <div
              v-if="isDropdownOpen"
              v-clickoutside="handleClickOutside"
              class="absolute top-60px left-1/2 -translate-x-1/2 w-220px bg-container rd-16px shadow-high border border-primary/10 p-8px z-50 overflow-hidden backdrop-blur-md bg-container/90"
            >
              <div class="px-12px py-8px text-12px font-bold text-slate-400 uppercase tracking-wider">菜单选项</div>
              <div class="space-y-4px">
                <div
                  v-for="(item, index) in ['个人中心', '系统设置', '消息通知', '安全退出']"
                  :key="index"
                  class="flex items-center gap-12px px-12px py-10px rd-10px hover:bg-primary/10 hover:text-primary cursor-pointer transition-all duration-200 group"
                  @click="handleMenuItemClick(item)"
                >
                  <SvgIcon
                    :icon="['ph:user-duotone', 'ph:gear-duotone', 'ph:bell-duotone', 'ph:sign-out-duotone'][index]"
                    class="text-18px text-slate-400 group-hover:text-primary"
                  />
                  <span class="text-14px font-medium">{{ item }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <p class="mt-32px text-14px text-slate-400">试试点击按钮打开菜单，然后点击此区域之外的任何地方</p>
      </div>
    </NCard>

    <!-- Guide -->
    <CodeBlock title="代码实现" :code="usageCode" />
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s cubic-bezier(0, 0, 0.2, 1);
}
.fade-scale-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.95) translateY(-10px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.95) translateY(-10px);
}
</style>

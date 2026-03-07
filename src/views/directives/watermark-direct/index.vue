<script setup lang="ts" name="watermarkDirect">
import { ref } from 'vue'

const watermarkText = ref('Fresh & Elegant')
const watermarkOpacity = ref(0.1)
const watermarkSize = ref(16)
const watermarkColor = ref('#059669')
const watermarkAngle = ref(-20)

const presetTexts = ['Fresh & Elegant', '机密文档', 'CONFIDENTIAL', '内部资料', 'DRAFT', '版权所有']

/** 预设颜色 */
const presetColors = [
  { name: '翡翠绿', value: '#059669' },
  { name: '经典黑', value: '#000000' },
  { name: '柔和蓝', value: '#3b82f6' },
  { name: '活力橙', value: '#f59e0b' },
  { name: '警示红', value: '#ef4444' },
]

const currentWatermark = ref({
  text: watermarkText.value,
  opacity: watermarkOpacity.value,
  fontSize: watermarkSize.value,
  color: watermarkColor.value,
  rotate: watermarkAngle.value,
})

const updateWatermark = () => {
  currentWatermark.value = {
    text: watermarkText.value,
    opacity: watermarkOpacity.value,
    fontSize: watermarkSize.value,
    color: watermarkColor.value,
    rotate: watermarkAngle.value,
  }
}

const setPresetText = (text: string) => {
  watermarkText.value = text
  updateWatermark()
}

const setPresetColor = (color: string) => {
  watermarkColor.value = color
  updateWatermark()
}

const resetSettings = () => {
  watermarkText.value = 'Fresh & Elegant'
  watermarkOpacity.value = 0.1
  watermarkSize.value = 16
  watermarkColor.value = '#059669'
  watermarkAngle.value = -20
  updateWatermark()
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:shield-check-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">水印指令 `v-watermark`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            为页面或特定容器添加防盗用水印保护，支持高度自定义的文本、颜色与角度
          </p>
        </div>
      </div>
    </NCard>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-16px">
      <!-- Controls -->
      <NCard title="⚙️ 水印配置" :bordered="false" class="card-wrapper lg:col-span-1" header-style="font-bold text-18px">
        <template #header-extra>
          <NButton quaternary @click="resetSettings">
            <template #icon><SvgIcon icon="ph:arrow-counter-clockwise-duotone" /></template>
            重置配置
          </NButton>
        </template>

        <div class="flex-col gap-20px">
          <div class="space-y-8px">
            <label class="text-14px font-bold text-base-text">水印文本</label>
            <NInput v-model:value="watermarkText" placeholder="输入水印内容" @input="updateWatermark" class="rd-8px" />
            <div class="flex flex-wrap gap-8px mt-12px">
              <NButton v-for="text in presetTexts" :key="text" size="tiny" secondary strong @click="setPresetText(text)" class="rd-4px">
                {{ text }}
              </NButton>
            </div>
          </div>

          <div class="space-y-8px">
            <label class="text-14px font-bold text-base-text">颜色预设</label>
            <div class="flex gap-12px">
              <div
                v-for="color in presetColors"
                :key="color.value"
                class="size-24px rd-full cursor-pointer transition-transform hover:scale-125 border border-layout"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
                @click="setPresetColor(color.value)"
              />
            </div>
          </div>

          <div class="space-y-8px">
            <div class="flex justify-between">
              <label class="text-14px font-bold text-base-text">透明度</label>
              <span class="text-12px font-mono text-primary">{{ watermarkOpacity }}</span>
            </div>
            <NSlider v-model:value="watermarkOpacity" :step="0.01" :min="0.05" :max="0.5" @update:value="updateWatermark" />
          </div>

          <div class="space-y-8px">
            <div class="flex justify-between">
              <label class="text-14px font-bold text-base-text">旋转角度</label>
              <span class="text-12px font-mono text-primary">{{ watermarkAngle }}°</span>
            </div>
            <NSlider v-model:value="watermarkAngle" :min="-90" :max="90" @update:value="updateWatermark" />
          </div>
        </div>
      </NCard>

      <!-- Preview Area -->
      <NCard title="🛡️ 效果预览" :bordered="false" class="card-wrapper lg:col-span-2" header-style="font-bold text-18px">
        <div
          v-watermark="currentWatermark"
          class="relative h-400px rd-16px bg-layout border-2 border-dashed border-primary/10 flex-center overflow-hidden transition-all duration-500"
        >
          <div
            class="relative z-10 text-center p-24px bg-container/80 backdrop-blur-sm rd-24px shadow-high max-w-400px border border-white/20"
          >
            <SvgIcon icon="ph:lock-duotone" class="text-48px text-primary mb-16px mx-auto" />
            <h3 class="text-20px font-bold text-base-text mb-12px">受保护的内容区域</h3>
            <p class="text-14px text-slate-500 leading-relaxed">
              此区域已启用 `v-watermark`
              指令。水印会自动覆盖在内容之上，且不会干扰用户的正常交互操作。您可以尝试在左侧调整参数，实时观察水印的变化效果。
            </p>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Usage -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 基础用法 --&gt;
&lt;div v-watermark="'版权所有'"&gt;...&lt;/div&gt;

&lt;!-- 高级配置 --&gt;
&lt;div v-watermark="{ 
  text: '机密', 
  color: 'rgba(0,0,0,0.1)', 
  fontSize: 16, 
  rotate: -20 
}"&gt;...&lt;/div&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

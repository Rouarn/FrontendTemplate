<script setup lang="ts">
import ConfigOperation from './modules/config-operation.vue'
import DarkMode from './modules/dark-mode.vue'
import ThemeColor from './modules/theme-color.vue'
import WatermarkSettings from './modules/watermark-settings.vue'
import { useAppStore } from '@/stores/modules/app'
import { $t } from '@/locales'

defineOptions({
  name: 'ThemeDrawer',
})

const appStore = useAppStore()
</script>

<template>
  <NDrawer v-model:show="appStore.themeDrawerVisible" display-directive="show" :width="appStore.isMobile ? '100%' : 360">
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <div class="flex items-center gap-12px">
          <div class="flex-center size-38px rd-12px bg-primary/10 text-primary shadow-low">
            <SvgIcon icon="ph:sliders-horizontal-duotone" class="text-20px" />
          </div>
          <h3 class="text-16px font-bold text-base-text">{{ $t('theme.themeDrawerTitle') }}</h3>
        </div>
      </template>

      <DarkMode />
      <ThemeColor />
      <WatermarkSettings />
      <template #footer>
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>

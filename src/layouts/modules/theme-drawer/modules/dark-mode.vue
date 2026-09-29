<script setup lang="ts">
import SettingItem from '../components/setting-item.vue'
import { useThemeStore } from '@/stores/modules/theme'
import { $t } from '@/locales'

defineOptions({
  name: 'DarkMode',
})

const themeStore = useThemeStore()

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto',
}
const themeSchemaRecord: Record<UnionKey.ThemeScheme, App.I18n.I18nKey> = {
  light: 'theme.themeSchema.light',
  dark: 'theme.themeSchema.dark',
  auto: 'theme.themeSchema.auto',
}

function handleSegmentChange(value: string | number) {
  themeStore.setThemeScheme(value as UnionKey.ThemeScheme)
}

function handleGrayscaleChange(value: boolean) {
  themeStore.setGrayscale(value)
}

function handleColourWeaknessChange(value: boolean) {
  themeStore.setColourWeakness(value)
}
</script>

<template>
  <section class="mb-18px">
    <!-- 分区标题 -->
    <div class="mb-10px flex items-center gap-8px">
      <div class="flex-center size-26px rd-8px bg-primary/10 text-primary">
        <SvgIcon icon="ph:circle-half-duotone" class="text-15px" />
      </div>
      <h4 class="text-13px font-bold text-base-text">{{ $t('theme.themeSchema.title') }}</h4>
    </div>

    <!-- 分组内容 -->
    <div class="flex-col gap-14px rd-14px bg-layout p-14px">
      <div class="i-flex-center">
        <NTabs
          :key="themeStore.themeScheme"
          type="segment"
          size="small"
          class="relative w-214px max-w-full"
          :value="themeStore.themeScheme"
          @update:value="handleSegmentChange"
        >
          <NTab v-for="(_, key) in themeSchemaRecord" :key="key" :name="key">
            <SvgIcon :icon="icons[key]" class="h-23px text-icon-small" />
          </NTab>
        </NTabs>
      </div>
      <SettingItem :label="$t('theme.grayscale')">
        <NSwitch :value="themeStore.grayscale" @update:value="handleGrayscaleChange" />
      </SettingItem>
      <SettingItem :label="$t('theme.colourWeakness')">
        <NSwitch :value="themeStore.colourWeakness" @update:value="handleColourWeaknessChange" />
      </SettingItem>
    </div>
  </section>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>

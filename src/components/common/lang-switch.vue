<script setup lang="ts">
import { computed } from 'vue'
import { $t } from '@/locales'

defineOptions({
  name: 'LangSwitch',
})

interface Props {
  /** 当前语言 */
  lang: App.I18n.LangType
  /** 语言选项 */
  langOptions: App.I18n.LangOption[]
  /** 是否显示提示 */
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
})

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void
}

const emit = defineEmits<Emits>()

const tooltipContent = computed(() => {
  if (!props.showTooltip) return ''

  return $t('icon.lang')
})

/** 除最后一项外均添加底部间距，保证视觉分隔 */
const dropdownOptions = computed(() => {
  const lastIndex = props.langOptions.length - 1

  return props.langOptions.map((option, index) => ({
    ...option,
    props: {
      class: index < lastIndex ? 'mb-1' : undefined,
    },
  }))
})

function changeLang(lang: App.I18n.LangType) {
  emit('changeLang', lang)
}
</script>

<template>
  <NDropdown :value="lang" :options="dropdownOptions" trigger="hover" @select="changeLang">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>

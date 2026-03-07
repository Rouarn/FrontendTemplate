<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { $t } from '@/locales'

defineOptions({ name: 'ExceptionBase' })

type ExceptionType = '403' | '404' | '500'

interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType
}

const props = defineProps<Props>()

const router = useRouter()

const iconMap: Record<ExceptionType, string> = {
  '403': 'no-permission',
  '404': 'not-found',
  '500': 'service-error',
}

const icon = computed(() => iconMap[props.type])
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-32px overflow-hidden bg-layout p-24px">
    <div class="flex-center text-400px text-primary/80 transition-transform duration-500 hover:scale-105">
      <SvgIcon :local-icon="icon" />
    </div>
    <div class="flex-col-center gap-12px text-center">
      <h1 class="text-32px font-bold text-base-text opacity-90">{{ type }}</h1>
      <p class="text-16px text-slate-500 max-w-400px">
        {{ $t(`common.${type === '403' ? 'noPermission' : type === '404' ? 'notFound' : 'serviceError'}`) }}
      </p>
    </div>
    <NButton
      type="primary"
      size="large"
      class="rd-8px px-32px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
      @click="router.push('/')"
    >
      {{ $t('common.backToHome') }}
    </NButton>
  </div>
</template>

<style scoped></style>

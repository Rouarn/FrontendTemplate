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

const description = computed(() =>
  $t(props.type === '403' ? 'common.noPermission' : props.type === '404' ? 'common.notFound' : 'common.serviceError'),
)
</script>

<template>
  <div class="exception relative flex-col-center min-h-560px overflow-hidden bg-layout p-24px">
    <!-- 背景装饰 -->
    <div class="exception-grid" />
    <div class="pointer-events-none absolute -top-160px -left-160px size-400px rd-full bg-primary/8 blur-[90px]" />
    <div class="pointer-events-none absolute -bottom-180px -right-160px size-400px rd-full bg-blue-500/8 blur-[90px]" />

    <!-- 图标 -->
    <div class="relative">
      <div class="absolute inset-0 -z-1 scale-90 rd-full bg-primary/10 blur-3xl" />
      <div class="exception-icon flex-center size-300px text-primary transition-transform duration-500 hover:scale-105">
        <SvgIcon :local-icon="icon" />
      </div>
    </div>

    <!-- 文案 -->
    <div class="relative mt-8px flex-col-center gap-12px text-center">
      <h1 class="text-40px font-bold tracking-tight text-base-text">{{ type }}</h1>
      <p class="max-w-400px text-16px text-slate-500">{{ description }}</p>
    </div>

    <!-- 返回首页 -->
    <NButton
      type="primary"
      size="large"
      class="mt-36px rd-12px px-32px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
      @click="router.push('/')"
    >
      <template #icon>
        <SvgIcon icon="ph:house-duotone" />
      </template>
      {{ $t('common.backToHome') }}
    </NButton>
  </div>
</template>

<style lang="scss" scoped>
.exception-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(var(--base-text-color) / 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--base-text-color) / 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 20%, transparent 75%);
}

.exception-icon {
  animation: exception-float 4.5s ease-in-out infinite;
}

@keyframes exception-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .exception-icon {
    animation: none;
  }
}
</style>

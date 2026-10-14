<script setup lang="ts">
import { computed } from 'vue'
import AvatarUploader from './avatar-uploader.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { $t } from '@/locales'

defineOptions({
  name: 'UserProfileCard',
})

defineProps<{
  /** 头像地址（与父组件 userForm.avatar 双向绑定） */
  avatar: string
  /** 昵称 */
  nickname: string
  /** 是否处于编辑态 */
  editable: boolean
}>()

const emit = defineEmits<{
  'update:avatar': [url: string]
  uploaded: [url: string]
}>()

const authStore = useAuthStore()

const statusText = computed(() => {
  return authStore.userInfo.auth.status === 1 ? $t('userCenter.normal') : $t('userCenter.disabled')
})

const statusType = computed(() => {
  return authStore.userInfo.auth.status === 1 ? 'success' : 'error'
})

// 格式化日期
function formatDate(dateStr?: string | Date) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
}

// 上传成功：由父组件持久化到 authStore
function handleUploaded(url: string) {
  emit('uploaded', url)
}
</script>

<template>
  <NCard :bordered="false" class="card-wrapper text-center overflow-hidden">
    <div class="relative pt-28px pb-32px">
      <div class="profile-banner absolute top-0 left-0 w-full h-110px" />
      <div class="relative flex-center flex-col gap-16px z-10">
        <AvatarUploader
          :avatar="avatar"
          :nickname="nickname"
          :user-id="authStore.userInfo.id"
          :editable="editable"
          @update:avatar="emit('update:avatar', $event)"
          @uploaded="handleUploaded"
        />
        <div class="space-y-4px">
          <h3 class="text-20px font-bold text-base-text">{{ nickname }}</h3>
          <p class="text-14px text-slate-500 font-medium">
            @{{ authStore.userInfo.auth.username }}
          </p>
          <NTag :type="statusType" size="small" round class="mt-4px font-bold px-12px">{{
            statusText
          }}</NTag>
        </div>
      </div>
    </div>

    <div class="border-t border-layout pt-24px space-y-16px text-left">
      <div class="flex justify-between items-center">
        <span class="text-14px text-slate-500 font-medium">{{ $t('userCenter.userId') }}</span>
        <span
          class="text-12px text-slate-400 font-mono bg-layout px-8px py-2px rd-4px truncate max-w-120px"
          :title="authStore.userInfo.id"
        >
          {{ authStore.userInfo.id }}
        </span>
      </div>
    </div>
  </NCard>

  <!-- Login Stats -->
  <NCard :bordered="false" class="card-wrapper" :title="$t('userCenter.accountActivity')">
    <template #header-extra>
      <SvgIcon icon="ph:chart-line-up-duotone" class="text-18px text-primary" />
    </template>
    <div class="space-y-16px">
      <div class="flex items-center gap-12px">
        <div class="size-32px flex-center bg-blue-500/10 text-blue-500 rd-8px">
          <SvgIcon icon="ph:clock-duotone" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-12px text-slate-400">{{ $t('userCenter.lastLoginTime') }}</p>
          <p class="text-13px font-medium text-slate-700 dark:text-slate-300 truncate">
            {{ formatDate(authStore.userInfo.auth.lastLoginAt) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-12px">
        <div class="size-32px flex-center bg-amber-500/10 text-amber-500 rd-8px">
          <SvgIcon icon="ph:map-pin-duotone" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-12px text-slate-400">{{ $t('userCenter.lastLoginIp') }}</p>
          <p class="text-13px font-medium text-slate-700 dark:text-slate-300 font-mono">
            {{ authStore.userInfo.auth.lastLoginIp || $t('userCenter.unknown') }}
          </p>
        </div>
      </div>
    </div>
  </NCard>
</template>

<style lang="scss" scoped>
.profile-banner {
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgb(var(--primary-color) / 0.2),
    rgb(var(--primary-color) / 0.02)
  );
}

.profile-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(var(--primary-color) / 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--primary-color) / 0.12) 1px, transparent 1px);
  background-size: 26px 26px;
  -webkit-mask-image: linear-gradient(to bottom, #000 30%, transparent);
  mask-image: linear-gradient(to bottom, #000 30%, transparent);
}
</style>

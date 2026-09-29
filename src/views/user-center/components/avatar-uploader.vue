<script setup lang="ts">
import { nextTick, ref } from 'vue'
import CroppingImage from '@/components/custom/cropping-image.vue'
import { uploadAvatar } from '@/service/api'
import { $t } from '@/locales'

defineOptions({
  name: 'AvatarUploader',
})

const props = defineProps<{
  /** 当前头像地址（双向绑定，上传预览/成功后同步更新） */
  avatar: string
  /** 昵称，用于生成上传文件名 */
  nickname: string
  /** 用户 ID，用于生成上传文件名 */
  userId: string
  /** 是否处于编辑态（仅编辑态显示上传入口） */
  editable: boolean
}>()

const emit = defineEmits<{
  'update:avatar': [url: string]
  /** 上传成功（已拿到远端完整 URL），由父组件持久化到 authStore */
  uploaded: [url: string]
}>()

const cutterRef = ref<InstanceType<typeof CroppingImage> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleAvatarClick() {
  fileInputRef.value?.click()
}

function onAvatarFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return
  cutterRef.value?.openCropper()
  nextTick(() => cutterRef.value?.setImage(f))
  // 重置 input，以便再次选择相同文件时能够触发 change 事件
  target.value = ''
}

async function onCropDone(payload: { blob?: Blob; fileName?: string }) {
  if (!payload.blob) return
  const type = payload.blob.type || 'image/jpeg'
  const name = `avatar_${props.userId}_${props.nickname || 'user'}_${Date.now()}.${type.split('/')[1] || 'jpeg'}`
  const file = new File([payload.blob], name, { type })

  // 预览：先用本地 URL，UI 立即响应
  emit('update:avatar', URL.createObjectURL(payload.blob))
  try {
    const res = await uploadAvatar(file)
    if (res?.completeUrl) {
      emit('update:avatar', res.completeUrl)
      emit('uploaded', res.completeUrl)
      window.$message?.success($t('userCenter.avatarUploadSuccess'))
    }
  } catch {
    // 上传失败提示由全局 onError 处理
  } finally {
    cutterRef.value?.closeCropper()
    cutterRef.value?.clearImage()
  }
}

function onCropError(msg: string) {
  window.$message?.error(msg)
}
</script>

<template>
  <div class="relative group size-100px">
    <NAvatar
      :size="100"
      round
      object-fit="cover"
      :src="avatar || 'http://static.shixian.xyz/static/photo?w=100&h=100'"
      fallback-src=""
      class="shadow-high ring-4 ring-white dark:ring-slate-800 transition-transform duration-500 group-hover:scale-105"
    />
    <div
      v-if="editable"
      class="absolute inset-0 flex-center bg-black/40 rd-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 cursor-pointer"
      @click="handleAvatarClick"
    >
      <SvgIcon icon="ph:camera-duotone" class="text-24px text-white" />
    </div>

    <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
    <CroppingImage
      ref="cutterRef"
      :cropper-title="$t('userCenter.croppingTitle')"
      :mask-closable="false"
      @done="onCropDone"
      @error="onCropError"
    />
  </div>
</template>

<style scoped></style>

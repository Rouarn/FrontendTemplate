<script setup lang="ts">
import { reactive, ref } from 'vue'
import { changePassword } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { $t } from '@/locales'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'PasswordChange',
})

const authStore = useAuthStore()
const passwordFormRef = ref<FormInst | null>(null)
const changingPassword = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码验证规则
const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码最少 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        return value === passwordForm.newPassword
      },
      message: '两次密码输入不一致',
      trigger: 'blur',
    },
  ],
}

async function handlePasswordChange() {
  try {
    await passwordFormRef.value?.validate()
    changingPassword.value = true
    const result = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    })

    Object.assign(passwordForm, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    window.$message?.success(result?.message || $t('userCenter.passwordChangeSuccess'))
    await authStore.resetStore()
  } catch {
    // 表单校验失败或请求失败（请求失败提示由全局 onError 处理）
  } finally {
    changingPassword.value = false
  }
}
</script>

<template>
  <div class="max-w-480px mx-auto pt-32px">
    <div class="text-center mb-40px">
      <div class="size-64px flex-center bg-amber-500/10 text-amber-500 rd-24px mx-auto mb-16px">
        <SvgIcon icon="ph:shield-check-duotone" class="text-32px" />
      </div>
      <h2 class="text-20px font-bold text-base-text">{{ $t('userCenter.changePassword') }}</h2>
      <p class="text-14px text-slate-500 mt-8px">{{ $t('userCenter.changePasswordDesc') }}</p>
    </div>

    <NForm ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="top">
      <NFormItem :label="$t('userCenter.currentPassword')" path="oldPassword">
        <NInput
          v-model:value="passwordForm.oldPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('userCenter.currentPasswordPlaceholder')"
          class="rd-8px"
        />
      </NFormItem>
      <NFormItem :label="$t('userCenter.newPassword')" path="newPassword">
        <NInput
          v-model:value="passwordForm.newPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('userCenter.newPasswordPlaceholder')"
          class="rd-8px"
        />
      </NFormItem>
      <NFormItem :label="$t('userCenter.confirmPassword')" path="confirmPassword">
        <NInput
          v-model:value="passwordForm.confirmPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('userCenter.confirmPasswordPlaceholder')"
          class="rd-8px"
        />
      </NFormItem>
      <div class="pt-16px">
        <NButton
          type="primary"
          block
          strong
          size="large"
          class="rd-12px text-16px shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
          @click="handlePasswordChange"
          :loading="changingPassword"
        >
          {{ $t('userCenter.confirmChange') }}
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped></style>

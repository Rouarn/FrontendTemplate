<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchCaptcha, fetchRegister } from '@/service/api/login'
import { $t } from '@/locales'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'UserRegister',
})

const emit = defineEmits<{
  registerSuccess: []
  switchToLogin: []
}>()

const formRef = ref<FormInst | null>(null)

const model = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  mobile: '',
  gender: 0 as Api.Common.Gender, // 0: 未知, 1: 男, 2: 女
  captcha: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: $t('page.login.common.username'), trigger: 'blur' },
    { min: 3, max: 20, message: $t('page.login.common.username'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: $t('page.login.common.password'), trigger: 'blur' },
    { min: 6, message: $t('page.login.common.password'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: $t('page.login.common.confirmPassword'), trigger: 'blur' },
    {
      validator: (_rule, value) => {
        return value === model.password
      },
      message: $t('page.login.common.confirmPassword'),
      trigger: 'blur',
    },
  ],
  captcha: { required: true, message: $t('page.login.common.captcha'), trigger: 'blur' },
  email: {
    type: 'email',
    message: $t('page.login.common.emailOptional'),
    trigger: 'blur',
  },
  mobile: {
    pattern: /^1[3-9]\d{9}$/,
    message: $t('page.login.common.mobileOptional'),
    trigger: 'blur',
  },
}

const captchaCode = ref('') // 验证码图片
const captchaToken = ref('') // 验证码token
const loading = ref(false)

// 生成验证码
async function generateCaptcha() {
  const { data, error } = await fetchCaptcha()
  if (error) {
    return
  }
  captchaCode.value = data.image
  captchaToken.value = data.token
}

// 重置验证码
async function resetCaptcha() {
  model.captcha = ''
  captchaToken.value = ''
  await generateCaptcha()
}

// 初始化验证码
onMounted(() => {
  generateCaptcha()
})

async function handleRegister() {
  await formRef.value?.validate()

  if (loading.value) {
    return
  }

  loading.value = true

  try {
    const { error, message } = await fetchRegister({
      username: model.username,
      password: model.password,
      nickname: model.nickname || model.username, // 默认昵称为用户名
      email: model.email,
      mobile: model.mobile,
      gender: model.gender,
      captchaCode: model.captcha,
      captchaToken: captchaToken.value,
    })

    if (error) {
      window.$message?.error(message || $t('page.login.common.registerFailed'))
      await resetCaptcha()
      return
    }

    window.$message?.success($t('page.login.common.registerSuccess'))
    emit('registerSuccess')
  } catch (_) {
    window.$message?.error($t('page.login.common.registerFailed'))
    await resetCaptcha()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleRegister">
    <NFormItem path="username">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.username')" class="rd-8px">
        <template #prefix>
          <div class="i-ph:user-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.password')"
        class="rd-8px"
      >
        <template #prefix>
          <div class="i-ph:lock-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPassword')"
        class="rd-8px"
      >
        <template #prefix>
          <div class="i-ph:shield-warning-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="nickname">
      <NInput v-model:value="model.nickname" :placeholder="$t('page.login.common.nicknameOptional')" class="rd-8px">
        <template #prefix>
          <div class="i-ph:identification-card-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="email">
      <NInput v-model:value="model.email" :placeholder="$t('page.login.common.emailOptional')" class="rd-8px">
        <template #prefix>
          <div class="i-ph:envelope-simple-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="mobile">
      <NInput v-model:value="model.mobile" :placeholder="$t('page.login.common.mobileOptional')" class="rd-8px">
        <template #prefix>
          <div class="i-ph:phone-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="captcha">
      <div class="flex w-full gap-12px items-center">
        <NInput v-model:value="model.captcha" :placeholder="$t('page.login.common.captcha')" class="flex-1 rd-8px">
          <template #prefix>
            <div class="i-ph:shield-check-duotone text-20px text-primary/60" />
          </template>
        </NInput>
        <div
          class="h-42px cursor-pointer overflow-hidden rd-8px border border-primary/10 bg-primary/5 transition-all duration-300 hover:border-primary/30"
          @click="resetCaptcha"
        >
          <img v-if="captchaCode" :src="captchaCode" alt="验证码" class="h-full w-100px object-cover" />
          <div v-else class="flex-center h-full w-100px text-12px text-slate-400">{{ $t('page.login.common.loading') }}</div>
        </div>
      </div>
    </NFormItem>

    <div class="flex flex-col gap-12px">
      <NButton
        type="primary"
        block
        :loading="loading"
        class="rd-8px text-16px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
        @click="handleRegister"
      >
        {{ $t('page.login.common.register') }}
      </NButton>
      <NButton block ghost class="rd-8px" @click="emit('switchToLogin')"> {{ $t('page.login.common.backToLogin') }} </NButton>
    </div>
  </NForm>
</template>

<style scoped></style>

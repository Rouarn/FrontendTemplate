<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchCaptcha, fetchCaptchaCheck } from '@/service/api/login'
import { useAuthStore } from '@/stores/modules/auth'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'PwdLogin',
})

const emit = defineEmits<{
  loginSuccess: []
}>()

const authStore = useAuthStore()

const formRef = ref<FormInst | null>(null)
const model = reactive({
  userName: 'superadmin',
  password: '123456',
  captcha: '',
})

const rules: FormRules = {
  userName: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  captcha: {
    required: true,
    message: '请输入验证码',
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

async function handleLogin() {
  await formRef.value?.validate()

  if (loading.value) {
    return
  }

  loading.value = true

  try {
    const { error } = await fetchCaptchaCheck({
      token: captchaToken.value,
      code: model.captcha,
    })

    if (error) {
      await resetCaptcha()
      return
    }

    await authStore.login(model.userName, model.password)

    if (authStore.isLogin) {
      emit('loginSuccess')
    }
  } catch {
    await resetCaptcha()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleLogin">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" placeholder="用户名" class="rd-8px">
        <template #prefix>
          <div class="i-ph:user-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="password">
      <NInput v-model:value="model.password" type="password" show-password-on="click" placeholder="密码" class="rd-8px">
        <template #prefix>
          <div class="i-ph:lock-duotone text-20px text-primary/60" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="captcha">
      <div class="flex w-full gap-12px items-center">
        <NInput v-model:value="model.captcha" placeholder="验证码" class="flex-1 rd-8px">
          <template #prefix>
            <div class="i-ph:shield-check-duotone text-20px text-primary/60" />
          </template>
        </NInput>
        <div
          class="h-42px cursor-pointer overflow-hidden rd-8px border border-primary/10 bg-primary/5 transition-all duration-300 hover:border-primary/30"
          @click="resetCaptcha"
        >
          <img v-if="captchaCode" :src="captchaCode" alt="验证码" class="h-full w-100px object-cover" />
          <div v-else class="flex-center h-full w-100px text-12px text-slate-400">加载中...</div>
        </div>
      </div>
    </NFormItem>
    <NButton
      type="primary"
      block
      :loading="loading"
      class="rd-8px text-16px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
      @click="handleLogin"
    >
      登录
    </NButton>
  </NForm>
</template>

<style scoped></style>

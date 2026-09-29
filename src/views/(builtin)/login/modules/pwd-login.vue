<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchCaptcha } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { $t } from '@/locales'
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
  userName: '',
  password: '',
  captcha: '',
})

const rules: FormRules = {
  userName: {
    required: true,
    message: $t('page.login.common.username'),
    trigger: 'blur',
  },
  password: {
    required: true,
    message: $t('page.login.common.password'),
    trigger: 'blur',
  },
  captcha: {
    required: true,
    message: $t('page.login.common.captcha'),
    trigger: 'blur',
  },
}

const captchaCode = ref('') // 验证码图片
const captchaToken = ref('') // 验证码token
const loading = ref(false)

// 生成验证码
async function generateCaptcha() {
  try {
    const data = await fetchCaptcha()
    captchaCode.value = data.image
    captchaToken.value = data.token
  } catch {
    // 验证码获取失败提示由全局 onError 处理
  }
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
    await authStore.login(model.userName, model.password, model.captcha, captchaToken.value)

    if (authStore.isLogin) {
      emit('loginSuccess')
    } else {
      await resetCaptcha()
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
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.username')" class="rd-8px">
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
    <NButton
      type="primary"
      block
      :loading="loading"
      class="rd-8px text-16px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
      @click="handleLogin"
    >
      {{ $t('page.login.common.login') }}
    </NButton>
  </NForm>
</template>

<style scoped></style>

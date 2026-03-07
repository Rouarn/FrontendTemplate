<script setup lang="ts">
import { ref } from 'vue'
import PwdLogin from './modules/pwd-login.vue'
import UserRegister from './modules/register.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'

defineOptions({
  name: 'GlobalLogin',
})

type LoginMode = 'pwd' | 'register'

const loginMode = ref<LoginMode>('pwd')

function switchMode(mode: LoginMode) {
  loginMode.value = mode
}

function handleLoginSuccess() {
  // 登录成功后的处理，通常由 store 或 router 处理跳转
}

function handleRegisterSuccess() {
  switchMode('pwd')
}

function handleSwitchToLogin() {
  switchMode('pwd')
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center bg-layout px-16px">
    <NCard class="w-full max-w-400px shadow-high rd-xl" :bordered="false" size="large">
      <div class="mb-32px flex flex-col items-center gap-12px">
        <div class="rd-full bg-primary/10 p-12px dark:bg-primary/20">
          <SvgIcon icon="ph:feather-duotone" class="text-40px text-primary" />
        </div>
        <h2 class="text-24px font-bold text-base-text">
          {{ loginMode === 'register' ? '创建账号' : '欢迎回来' }}
        </h2>
        <p class="text-14px text-slate-500">
          {{ loginMode === 'register' ? '填写以下信息完成注册' : '请输入您的账号和密码登录' }}
        </p>
      </div>

      <div class="w-full">
        <Transition name="fade-slide" mode="out-in" appear>
          <div v-if="loginMode === 'pwd'" key="pwd">
            <PwdLogin @login-success="handleLoginSuccess" />
            <div class="mt-24px flex items-center justify-center gap-8px text-14px">
              <span class="text-slate-500">还没有账号？</span>
              <NButton text type="primary" class="font-medium" @click="switchMode('register')"> 立即注册 </NButton>
            </div>
          </div>

          <div v-else key="register">
            <UserRegister @register-success="handleRegisterSuccess" @switch-to-login="handleSwitchToLogin" />
          </div>
        </Transition>
      </div>
    </NCard>

    <div class="absolute bottom-24px text-center text-12px text-slate-400">Fresh & Elegant &copy; {{ new Date().getFullYear() }}</div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

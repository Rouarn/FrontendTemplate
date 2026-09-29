<script setup lang="ts">
import { ref } from 'vue'
import PwdLogin from './modules/pwd-login.vue'
import UserRegister from './modules/register.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { $t } from '@/locales'

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
  <div class="auth-page relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-layout px-16px py-48px">
    <!-- 固定渐变背景层（不随内容滚动，页面任何位置都铺满） -->
    <div class="auth-bg pointer-events-none fixed inset-0 overflow-hidden">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
      <div class="auth-dots" />
    </div>

    <!-- 顶部品牌 -->
    <div class="relative mb-28px flex items-center gap-12px">
      <div class="glass-badge flex-center size-42px rd-14px text-primary">
        <SvgIcon icon="ph:feather-duotone" class="text-23px" />
      </div>
      <span class="text-18px font-bold tracking-wide text-base-text">Fresh &amp; Elegant</span>
    </div>

    <!-- 玻璃拟态卡片（高度随内容自适应，不锁高度、不做内部滚动） -->
    <div class="glass-card relative w-full max-w-420px p-32px sm:p-40px">
      <div class="mb-28px">
        <h2 class="text-24px font-bold text-base-text">
          {{ loginMode === 'register' ? $t('page.login.common.createAccount') : $t('page.login.common.welcomeBack') }}
        </h2>
        <p class="mt-8px text-14px text-slate-500 dark:text-slate-400">
          {{ loginMode === 'register' ? $t('page.login.common.fillRegisterInfo') : $t('page.login.common.enterCredentials') }}
        </p>
      </div>

      <Transition name="auth-swap" mode="out-in" appear>
        <div v-if="loginMode === 'pwd'" key="pwd">
          <PwdLogin @login-success="handleLoginSuccess" />
          <div class="mt-24px flex items-center justify-center gap-8px text-14px">
            <span class="text-slate-500 dark:text-slate-400">{{ $t('page.login.common.noAccount') }}</span>
            <NButton text type="primary" class="font-medium" @click="switchMode('register')">
              {{ $t('page.login.common.registerNow') }}
            </NButton>
          </div>
        </div>

        <div v-else key="register">
          <UserRegister @register-success="handleRegisterSuccess" @switch-to-login="handleSwitchToLogin" />
        </div>
      </Transition>
    </div>

    <!-- 底部版权 -->
    <p class="relative mt-28px text-center text-12px text-slate-400 dark:text-slate-500">
      Fresh &amp; Elegant &copy; {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  /* 让毛玻璃在不同主题下都有稳定背景基调 */
  isolation: isolate;
}

/* ---------- 渐变漂移光斑 ---------- */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  will-change: transform;
}

.blob-1 {
  top: -160px;
  left: -120px;
  width: 520px;
  height: 520px;
  background: rgb(var(--primary-color) / 0.28);
  animation: blob-drift-1 22s ease-in-out infinite;
}

.blob-2 {
  top: 8%;
  right: -180px;
  width: 480px;
  height: 480px;
  background: rgb(99 102 241 / 0.22);
  animation: blob-drift-2 26s ease-in-out infinite;
}

.blob-3 {
  bottom: -200px;
  left: 22%;
  width: 460px;
  height: 460px;
  background: rgb(236 72 153 / 0.16);
  animation: blob-drift-3 30s ease-in-out infinite;
}

:global(html.dark) .blob {
  opacity: 0.55;
}

@keyframes blob-drift-1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(90px, 60px) scale(1.12);
  }
}

@keyframes blob-drift-2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-80px, 90px) scale(1.08);
  }
}

@keyframes blob-drift-3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(60px, -70px) scale(1.14);
  }
}

/* ---------- 细腻点阵纹理 ---------- */
.auth-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(var(--base-text-color) / 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* ---------- 玻璃材质 ---------- */
.glass-card {
  background: rgb(var(--container-bg-color) / 0.72);
  border: 1px solid rgb(255 255 255 / 0.35);
  border-radius: 24px;
  box-shadow:
    0 24px 70px -20px rgb(15 23 42 / 0.22),
    inset 0 1px 0 rgb(255 255 255 / 0.5);
  backdrop-filter: blur(22px) saturate(1.5);
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
}

:global(html.dark) .glass-card {
  background: rgb(var(--container-bg-color) / 0.6);
  border-color: rgb(255 255 255 / 0.09);
  box-shadow:
    0 24px 70px -20px rgb(0 0 0 / 0.6),
    inset 0 1px 0 rgb(255 255 255 / 0.06);
}

.glass-badge {
  background: rgb(var(--container-bg-color) / 0.7);
  border: 1px solid rgb(255 255 255 / 0.3);
  box-shadow: 0 8px 24px -10px rgb(15 23 42 / 0.2);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

:global(html.dark) .glass-badge {
  border-color: rgb(255 255 255 / 0.1);
}

/* ---------- 登录/注册切换过渡 ---------- */
.auth-swap-enter-active,
.auth-swap-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.auth-swap-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.auth-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>

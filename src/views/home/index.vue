<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { $t } from '@/locales'
import pkg from '~/package.json'
import type { Directive } from 'vue'

const router = useRouter()

interface FeatureItem {
  icon: string
  title: string
  description: string
  color: string
}

const features = computed<FeatureItem[]>(() => [
  {
    icon: 'ph:speedometer-duotone',
    title: $t('page.home.feature1Title'),
    description: $t('page.home.feature1Desc'),
    color: '#10b981',
  },
  {
    icon: 'ph:palette-duotone',
    title: $t('page.home.feature2Title'),
    description: $t('page.home.feature2Desc'),
    color: '#3b82f6',
  },
  {
    icon: 'ph:code-duotone',
    title: $t('page.home.feature3Title'),
    description: $t('page.home.feature3Desc'),
    color: '#f59e0b',
  },
  {
    icon: 'ph:devices-duotone',
    title: $t('page.home.feature4Title'),
    description: $t('page.home.feature4Desc'),
    color: '#ef4444',
  },
])

const primaryFeature = computed(() => features.value[0])
const normalFeatures = computed(() => features.value.slice(1))

interface TechItem {
  name: string
  version: string
  icon: string
  description: string
}

const techStack = computed<TechItem[]>(() => [
  {
    name: 'Vue 3',
    version: '3.5+',
    icon: 'logos:vue',
    description: $t('page.home.progressiveFramework'),
  },
  {
    name: 'Vite 8',
    version: '8.x',
    icon: 'logos:vitejs',
    description: $t('page.home.nextGenBuildTool'),
  },
  {
    name: 'TypeScript',
    version: '5.x',
    icon: 'logos:typescript-icon',
    description: $t('page.home.typeSafe'),
  },
  {
    name: 'Naive UI',
    version: '2.x',
    icon: 'logos:naiveui',
    description: $t('page.home.highQualityComponentLib'),
  },
  {
    name: 'UnoCSS',
    version: '0.x',
    icon: 'logos:unocss',
    description: $t('page.home.atomicEngine'),
  },
  {
    name: 'Pinia',
    version: '2.x',
    icon: 'logos:pinia',
    description: $t('page.home.stateManagement'),
  },
])

const heroLogos = [
  'logos:vue',
  'logos:vitejs',
  'logos:typescript-icon',
  'logos:pinia',
  'logos:unocss',
]

/** 当前浏览器地址（模拟浏览器地址栏，展示主机名与端口） */
const currentHost = window.location.host

/** 当前站点源地址（模拟终端 Local 输出） */
const currentOrigin = window.location.origin

interface StatItem {
  icon: string
  value: string
  label: string
  /** 'primary' 跟随主题色，其余为十六进制色值 */
  tone: string
}

const stats = computed<StatItem[]>(() => [
  {
    icon: 'ph:git-branch-duotone',
    value: pkg.version,
    label: $t('page.home.currentVersion'),
    tone: 'primary',
  },
  {
    icon: 'ph:stack-duotone',
    value: String(Object.keys(pkg.dependencies).length),
    label: $t('page.home.coreDependencies'),
    tone: '#3b82f6',
  },
  {
    icon: 'ph:seal-check-duotone',
    value: pkg.license,
    label: $t('page.home.openSourceLicense'),
    tone: '#f59e0b',
  },
])

const principles = computed(() => [
  {
    icon: 'ph:cube-focus-duotone',
    number: '01',
    title: $t('page.home.philosophy1Title'),
    description: $t('page.home.philosophy1Desc'),
  },
  {
    icon: 'ph:git-fork-duotone',
    number: '02',
    title: $t('page.home.philosophy2Title'),
    description: $t('page.home.philosophy2Desc'),
  },
  {
    icon: 'ph:feather-duotone',
    number: '03',
    title: $t('page.home.philosophy3Title'),
    description: $t('page.home.philosophy3Desc'),
  },
])

// 按钮功能函数
const handleGetStarted = () => {
  router.push('/about')
}

const handleViewSource = () => {
  window.open(pkg.homepage || 'https://github.com', '_blank')
}

const handleDownload = () => {
  window.open(`${pkg.homepage}/releases`, '_blank')
}

const handleViewDocs = () => {
  window.open(pkg.website || 'https://github.com', '_blank')
}

// 滚动渐显指令：binding.value 为渐入延迟（毫秒）
const revealObservers = new WeakMap<HTMLElement, IntersectionObserver>()
const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) {
      el.style.transitionDelay = `${binding.value}ms`
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    revealObservers.set(el, observer)
  },
  unmounted(el) {
    revealObservers.get(el)?.disconnect()
    revealObservers.delete(el)
  },
}
</script>

<template>
  <div class="home-page relative min-h-screen overflow-hidden bg-layout">
    <!-- ============ Hero ============ -->
    <section class="relative">
      <div class="hero-grid" />
      <div
        class="pointer-events-none absolute -right-200px -top-200px size-480px rd-full bg-primary/10 blur-[100px]"
      />
      <div
        class="pointer-events-none absolute -bottom-220px -left-200px size-480px rd-full bg-blue-500/10 blur-[100px]"
      />

      <div
        class="relative mx-auto grid max-w-1200px grid-cols-1 items-center gap-56px px-24px pt-72px pb-88px lg:grid-cols-2"
      >
        <!-- 左侧文案 -->
        <div v-reveal>
          <div
            class="inline-flex h-34px items-center gap-10px rd-full border border-primary/15 bg-container px-16px shadow-low"
          >
            <span class="relative flex size-7px">
              <span
                class="absolute inline-flex h-full w-full animate-ping rd-full bg-primary opacity-60"
              />
              <span class="relative inline-flex size-7px rd-full bg-primary" />
            </span>
            <span class="text-12px font-medium text-base-text">
              {{ $t('page.home.heroBadge') }} · v{{ pkg.version }}
            </span>
          </div>

          <h1
            class="mt-28px text-52px leading-[1.15] font-bold tracking-tight text-base-text sm:text-64px"
          >
            <span class="text-primary">Fresh</span> &amp; Elegant
          </h1>
          <p class="mt-20px max-w-560px text-17px leading-relaxed text-slate-500">
            {{ $t('page.home.heroDescription') }}
          </p>

          <div class="mt-36px flex items-center gap-16px">
            <NButton
              type="primary"
              size="large"
              class="h-48px rd-12px px-32px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
              @click="handleGetStarted"
            >
              <template #icon>
                <SvgIcon icon="ph:play-circle-duotone" />
              </template>
              {{ $t('page.home.getStarted') }}
            </NButton>
            <NButton
              secondary
              size="large"
              class="h-48px rd-12px px-32px font-bold transition-all duration-300 active:scale-95"
              @click="handleViewSource"
            >
              <template #icon>
                <SvgIcon icon="ph:github-logo-duotone" />
              </template>
              {{ $t('page.home.viewSource') }}
            </NButton>
          </div>

          <div class="mt-44px flex items-center gap-22px">
            <SvgIcon
              v-for="logo in heroLogos"
              :key="logo"
              :icon="logo"
              class="size-26px opacity-45 transition-all duration-300 hover:scale-110 hover:opacity-100"
            />
          </div>
        </div>

        <!-- 右侧视觉：终端预览窗 -->
        <div v-reveal="150" class="relative mx-auto w-full max-w-520px">
          <div class="absolute inset-0 -z-1 scale-[0.92] rd-full bg-primary/12 blur-[80px]" />

          <div
            class="mock-window overflow-hidden rd-22px border border-base-text/8 bg-container shadow-high"
          >
            <!-- 窗口标题栏 -->
            <div class="flex items-center gap-12px border-b border-base-text/6 px-20px py-14px">
              <span class="size-11px rd-full bg-[#ff5f57]" />
              <span class="size-11px rd-full bg-[#febc2e]" />
              <span class="size-11px rd-full bg-[#28c840]" />
              <div
                class="ml-8px flex h-26px flex-1 items-center gap-6px rd-8px bg-layout px-10px text-11px text-slate-400"
              >
                <SvgIcon icon="ph:lock-simple-fill" class="text-10px" />
                {{ currentHost }}
              </div>
            </div>
            <!-- 终端内容 -->
            <div class="p-24px font-mono text-13px leading-7">
              <p><span class="term-dim">$</span> pnpm dev</p>
              <p>
                <span class="term-primary">✓</span> VITE v8 ready in
                <span class="term-amber">312</span> ms
              </p>
              <p>
                <span class="term-dim">➜</span> Local:
                <span class="term-sky">{{ currentOrigin }}/</span>
              </p>
              <p>
                <span class="term-dim">➜</span> press <span class="term-green">h</span> to show help
              </p>
              <div class="my-14px h-px bg-base-text/8" />
              <p>
                <span class="term-purple">const</span> <span class="term-sky">fresh</span> =
                <span class="term-green">'elegant'</span>
              </p>
              <p>
                <span class="term-purple">const</span> <span class="term-sky">stack</span> = [<span
                  class="term-green"
                  >'vue3'</span
                >, <span class="term-green">'vite8'</span>]
              </p>
              <p class="term-dim">// HMR updated in 12ms</p>
            </div>
          </div>

          <!-- 浮动玻璃徽标 -->
          <div
            class="chip-float absolute -top-16px -right-10px hidden items-center gap-8px rd-14px border border-base-text/8 bg-container/85 px-14px py-10px shadow-high backdrop-blur sm:flex"
          >
            <SvgIcon
              :icon="features[0].icon"
              class="text-20px"
              :style="{ color: features[0].color }"
            />
            <span class="text-12px font-medium text-base-text">{{ features[0].title }}</span>
          </div>
          <div
            class="chip-float absolute -left-14px bottom-72px hidden items-center gap-8px rd-14px border border-base-text/8 bg-container/85 px-14px py-10px shadow-high backdrop-blur sm:flex"
            style="animation-delay: -2s"
          >
            <SvgIcon
              :icon="features[2].icon"
              class="text-20px"
              :style="{ color: features[2].color }"
            />
            <span class="text-12px font-medium text-base-text">{{ features[2].title }}</span>
          </div>
          <div
            class="chip-float absolute -bottom-16px -right-16px hidden items-center gap-8px rd-14px border border-base-text/8 bg-container/85 px-14px py-10px shadow-high backdrop-blur sm:flex"
            style="animation-delay: -4s"
          >
            <SvgIcon
              :icon="features[1].icon"
              class="text-20px"
              :style="{ color: features[1].color }"
            />
            <span class="text-12px font-medium text-base-text">{{ features[1].title }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ Stats ============ -->
    <section class="mx-auto max-w-1200px px-24px pb-88px">
      <div class="grid grid-cols-1 gap-20px sm:grid-cols-3">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          v-reveal="index * 100"
          class="group flex items-center gap-20px rd-20px border border-base-text/6 bg-container p-26px shadow-low transition-all duration-300 hover:-translate-y-4px hover:shadow-high"
        >
          <div
            class="flex-center size-54px shrink-0 rd-16px transition-transform duration-300 group-hover:scale-110"
            :class="stat.tone === 'primary' ? 'bg-primary/10 text-primary' : ''"
            :style="
              stat.tone === 'primary' ? {} : { color: stat.tone, backgroundColor: `${stat.tone}14` }
            "
          >
            <SvgIcon :icon="stat.icon" class="text-26px" />
          </div>
          <div class="min-w-0">
            <div
              class="truncate text-30px leading-tight font-bold tabular-nums"
              :class="stat.tone === 'primary' ? 'text-primary' : ''"
              :style="stat.tone === 'primary' ? {} : { color: stat.tone }"
            >
              {{ stat.value }}
            </div>
            <div class="mt-8px text-13px text-slate-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ Core Features ============ -->
    <section class="mx-auto max-w-1200px px-24px py-88px">
      <div v-reveal class="mb-56px text-center">
        <h2 class="text-32px font-bold text-base-text">{{ $t('page.home.coreFeatures') }}</h2>
        <div class="mx-auto mt-10px h-4px w-48px rd-full bg-primary" />
        <p class="mt-16px text-16px text-slate-500">{{ $t('page.home.coreFeaturesDesc') }}</p>
      </div>

      <div class="grid grid-cols-1 gap-24px md:grid-cols-2 lg:grid-cols-3">
        <!-- 主推大卡片 -->
        <div
          v-reveal
          class="relative overflow-hidden rd-24px border border-base-text/8 p-36px shadow-low transition-all duration-300 hover:-translate-y-4px hover:shadow-high lg:col-span-2"
          :style="{
            background: `linear-gradient(135deg, ${primaryFeature.color}1a, transparent 62%)`,
          }"
        >
          <SvgIcon
            :icon="primaryFeature.icon"
            class="pointer-events-none absolute -right-10px -bottom-20px size-170px opacity-10"
            :style="{ color: primaryFeature.color }"
          />
          <div class="relative flex flex-col gap-24px sm:flex-row sm:items-center">
            <div
              class="flex-center size-72px shrink-0 rd-22px"
              :style="{ backgroundColor: `${primaryFeature.color}18`, color: primaryFeature.color }"
            >
              <SvgIcon :icon="primaryFeature.icon" class="text-38px" />
            </div>
            <div>
              <h3 class="text-22px font-bold text-base-text">{{ primaryFeature.title }}</h3>
              <p class="mt-10px max-w-460px text-15px leading-relaxed text-slate-500">
                {{ primaryFeature.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- 常规特性卡片 -->
        <div
          v-for="(feature, index) in normalFeatures"
          :key="feature.title"
          v-reveal="(index + 1) * 100"
          class="group relative overflow-hidden rd-24px border border-base-text/6 bg-container p-28px shadow-low transition-all duration-300 hover:-translate-y-4px hover:border-primary/25 hover:shadow-high"
        >
          <span class="absolute top-20px right-22px text-13px font-bold text-slate-300"
            >0{{ index + 2 }}</span
          >
          <div
            class="flex-center size-50px rd-16px transition-transform duration-300 group-hover:scale-110"
            :style="{ backgroundColor: `${feature.color}15`, color: feature.color }"
          >
            <SvgIcon :icon="feature.icon" class="text-25px" />
          </div>
          <h3 class="mt-22px text-18px font-bold text-base-text">{{ feature.title }}</h3>
          <p class="mt-10px text-14px leading-relaxed text-slate-500">{{ feature.description }}</p>
        </div>

        <!-- 品牌入口卡片 -->
        <button
          v-reveal
          type="button"
          class="group relative flex flex-col justify-between overflow-hidden rd-24px bg-primary p-28px text-left shadow-low transition-all duration-300 hover:-translate-y-4px hover:shadow-high"
          @click="handleGetStarted"
        >
          <div class="cta-grid" />
          <div class="relative">
            <div class="flex-center size-50px rd-16px bg-white/15 text-white">
              <SvgIcon icon="ph:rocket-launch-duotone" class="text-25px" />
            </div>
            <h3 class="mt-22px text-20px font-bold text-white">Fresh &amp; Elegant</h3>
          </div>
          <span
            class="relative mt-20px inline-flex items-center gap-6px text-13px font-bold text-white/90"
          >
            {{ $t('page.home.getStarted') }}
            <SvgIcon
              icon="ph:arrow-right-bold"
              class="text-12px transition-transform duration-300 group-hover:translate-x-4px"
            />
          </span>
        </button>
      </div>
    </section>

    <!-- ============ Tech Stack ============ -->
    <section class="bg-container/50 py-88px">
      <div class="mx-auto max-w-1200px px-24px">
        <div v-reveal class="mb-56px text-center">
          <h2 class="text-32px font-bold text-base-text">{{ $t('page.home.techStack') }}</h2>
          <div class="mx-auto mt-10px h-4px w-48px rd-full bg-primary" />
          <p class="mt-16px text-16px text-slate-500">{{ $t('page.home.techStackDesc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(tech, index) in techStack"
            :key="tech.name"
            v-reveal="(index % 3) * 100"
            class="tech-card group relative overflow-hidden rd-20px border border-base-text/6 bg-layout p-24px shadow-low transition-all duration-300 hover:-translate-y-4px hover:shadow-high"
          >
            <div class="flex items-center gap-18px">
              <div
                class="flex-center size-54px shrink-0 rd-15px bg-container p-10px transition-transform duration-300 group-hover:scale-110"
              >
                <SvgIcon :icon="tech.icon" class="size-full" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-8px">
                  <h3 class="text-17px font-bold text-base-text">{{ tech.name }}</h3>
                  <span
                    class="rd-4px bg-primary/10 px-6px py-2px text-12px font-medium text-primary"
                  >
                    {{ tech.version }}
                  </span>
                </div>
                <p class="mt-5px truncate text-13px text-slate-500">{{ tech.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ Design Philosophy ============ -->
    <section class="mx-auto max-w-1200px px-24px py-88px">
      <div v-reveal class="mb-56px text-center">
        <h2 class="text-32px font-bold text-base-text">{{ $t('page.home.philosophyTitle') }}</h2>
        <div class="mx-auto mt-10px h-4px w-48px rd-full bg-primary" />
        <p class="mt-16px text-16px text-slate-500">{{ $t('page.home.philosophyDesc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-24px md:grid-cols-3">
        <div
          v-for="(item, index) in principles"
          :key="item.number"
          v-reveal="index * 120"
          class="group relative overflow-hidden rd-24px border border-base-text/6 bg-container p-32px shadow-low transition-all duration-300 hover:-translate-y-4px hover:border-primary/25 hover:shadow-high"
        >
          <span
            class="absolute top-16px right-24px text-46px leading-none font-black text-primary/10"
          >
            {{ item.number }}
          </span>
          <div
            class="flex-center size-48px rd-14px bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"
          >
            <SvgIcon :icon="item.icon" class="text-24px" />
          </div>
          <h3 class="mt-20px text-18px font-bold text-base-text">{{ item.title }}</h3>
          <p class="mt-10px text-14px leading-relaxed text-slate-500">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="mx-auto max-w-1200px px-24px pb-104px">
      <div
        v-reveal
        class="group relative overflow-hidden rd-32px bg-primary p-64px text-center shadow-high"
      >
        <div class="cta-grid" />
        <div
          class="absolute top-0 right-0 size-300px -mr-150px -mt-150px rd-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125"
        />
        <div
          class="absolute bottom-0 left-0 size-300px -mb-150px -ml-150px rd-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125"
        />

        <h2 class="relative z-1 text-36px font-bold text-white">
          {{ $t('page.home.readyToStart') }}
        </h2>
        <p class="relative z-1 mx-auto mt-16px max-w-600px text-18px text-white/80">
          {{ $t('page.home.readyToStartDesc') }}
        </p>
        <div class="relative z-1 mt-40px flex items-center justify-center gap-16px">
          <NButton
            secondary
            strong
            size="large"
            class="rd-16px px-40px text-18px bg-white text-primary border-none shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
            @click="handleDownload"
          >
            <template #icon>
              <SvgIcon icon="ph:download-simple-duotone" />
            </template>
            {{ $t('page.home.downloadNow') }}
          </NButton>
          <NButton
            quaternary
            size="large"
            class="rd-16px px-40px text-18px text-white border-white/30 hover:bg-white/10 transition-all duration-300 active:scale-95"
            @click="handleViewDocs"
          >
            <template #icon>
              <SvgIcon icon="ph:book-open-duotone" />
            </template>
            {{ $t('page.home.readDocs') }}
          </NButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
/* Hero 背景网格 */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(var(--base-text-color) / 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--base-text-color) / 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 85% 60% at 50% 0%, #000 25%, transparent 75%);
  mask-image: radial-gradient(ellipse 85% 60% at 50% 0%, #000 25%, transparent 75%);
}

/* 主色块白色网格 */
.cta-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 0.09) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 0.09) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%);
}

/* 终端语法配色 */
.term-dim {
  color: rgb(var(--base-text-color) / 0.45);
}

.term-primary {
  color: rgb(var(--primary-color));
}

.term-amber {
  color: #f59e0b;
}

.term-sky {
  color: #38bdf8;
}

.term-green {
  color: #10b981;
}

.term-purple {
  color: #a78bfa;
}

/* 浮动徽标动画 */
.chip-float {
  animation: chip-float 5s ease-in-out infinite;
}

@keyframes chip-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* 滚动渐显 */
.reveal {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.65s ease,
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 技术卡片顶部高亮线 */
.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 24px;
  left: 24px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(var(--primary-color) / 0.55), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-card:hover::before {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .chip-float {
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { $t } from '@/locales'
import pkg from '~/package.json'

const router = useRouter()

const features = [
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
]

const techStack = [
  { name: 'Vue 3', version: '3.5+', icon: 'logos:vue', description: $t('page.home.progressiveFramework') },
  { name: 'Vite 8', version: '8.x', icon: 'logos:vitejs', description: $t('page.home.nextGenBuildTool') },
  { name: 'TypeScript', version: '5.x', icon: 'logos:typescript-icon', description: $t('page.home.typeSafe') },
  { name: 'Naive UI', version: '2.x', icon: 'ph:app-window-duotone', description: $t('page.home.highQualityComponentLib') },
  { name: 'UnoCSS', version: '0.x', icon: 'logos:unocss', description: $t('page.home.atomicEngine') },
  { name: 'Pinia', version: '2.x', icon: 'logos:pinia', description: $t('page.home.stateManagement') },
]

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
</script>

<template>
  <div class="min-h-screen bg-layout">
    <!-- Hero Section -->
    <div class="relative overflow-hidden pt-80px pb-120px">
      <div class="absolute -top-240px -right-240px size-480px rd-full bg-primary/5 blur-3xl" />
      <div class="absolute -bottom-240px -left-240px size-480px rd-full bg-blue-500/5 blur-3xl" />

      <div class="relative px-24px mx-auto max-w-1200px">
        <div class="text-center">
          <div class="flex justify-center mb-32px">
            <div class="p-20px bg-container rd-32px shadow-high transition-transform duration-500 hover:rotate-12">
              <SvgIcon icon="ph:rocket-launch-duotone" class="size-64px text-primary" />
            </div>
          </div>
          <h1 class="text-48px font-bold tracking-tight text-base-text sm:text-64px"><span class="text-primary">Fresh</span> & Elegant</h1>
          <p class="mt-24px text-18px leading-relaxed text-slate-500 max-w-700px mx-auto">
            {{ $t('page.home.heroDescription') }}
          </p>
          <div class="flex items-center justify-center mt-40px gap-16px">
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
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="px-24px py-80px mx-auto max-w-1200px">
      <div class="text-center mb-64px">
        <h2 class="text-32px font-bold text-base-text">{{ $t('page.home.coreFeatures') }}</h2>
        <div class="mt-8px h-4px w-48px bg-primary rd-full mx-auto" />
        <p class="mt-16px text-16px text-slate-500">{{ $t('page.home.coreFeaturesDesc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-32px sm:grid-cols-2 lg:grid-cols-4">
        <NCard v-for="feature in features" :key="feature.title" class="card-wrapper" :bordered="false">
          <div class="text-center p-8px">
            <div class="flex justify-center mb-20px">
              <div class="p-16px rd-20px transition-colors duration-300" :style="{ backgroundColor: feature.color + '15' }">
                <SvgIcon :icon="feature.icon" class="size-32px" :style="{ color: feature.color }" />
              </div>
            </div>
            <h3 class="text-18px font-bold text-base-text">
              {{ feature.title }}
            </h3>
            <p class="mt-12px text-14px text-slate-500 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </NCard>
      </div>
    </div>

    <!-- Tech Stack Section -->
    <div class="bg-container/50 py-80px">
      <div class="px-24px mx-auto max-w-1200px">
        <div class="text-center mb-64px">
          <h2 class="text-32px font-bold text-base-text">{{ $t('page.home.techStack') }}</h2>
          <div class="mt-8px h-4px w-48px bg-primary rd-full mx-auto" />
          <p class="mt-16px text-16px text-slate-500">{{ $t('page.home.techStackDesc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
          <NCard
            v-for="tech in techStack"
            :key="tech.name"
            class="card-wrapper hover:-translate-y-4px transition-transform duration-300"
            :bordered="false"
          >
            <div class="flex items-center gap-20px">
              <div class="size-56px flex-center bg-layout rd-16px p-12px">
                <SvgIcon :icon="tech.icon" class="size-full" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-8px">
                  <h3 class="text-18px font-bold text-base-text">{{ tech.name }}</h3>
                  <span class="text-12px px-6px py-2px bg-primary/10 text-primary rd-4px font-medium">{{ tech.version }}</span>
                </div>
                <p class="mt-4px text-14px text-slate-500">{{ tech.description }}</p>
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="px-24px py-80px mx-auto max-w-1200px">
      <div class="grid grid-cols-1 gap-40px sm:grid-cols-3">
        <div class="text-center p-32px rd-24px bg-primary/5 border border-primary/10 transition-all duration-300 hover:bg-primary/10">
          <div class="text-48px font-bold text-primary tabular-nums">{{ pkg.version }}</div>
          <div class="mt-8px text-16px font-medium text-slate-500">{{ $t('page.home.currentVersion') }}</div>
        </div>
        <div class="text-center p-32px rd-24px bg-blue-500/5 border border-blue-500/10 transition-all duration-300 hover:bg-blue-500/10">
          <div class="text-48px font-bold text-blue-500 tabular-nums">{{ Object.keys(pkg.dependencies).length }}</div>
          <div class="mt-8px text-16px font-medium text-slate-500">{{ $t('page.home.coreDependencies') }}</div>
        </div>
        <div class="text-center p-32px rd-24px bg-amber-500/5 border border-amber-500/10 transition-all duration-300 hover:bg-amber-500/10">
          <div class="text-40px font-bold text-amber-500 tabular-nums">{{ pkg.license }}</div>
          <div class="mt-8px text-16px font-medium text-slate-500">{{ $t('page.home.openSourceLicense') }}</div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="px-24px pb-120px mx-auto max-w-1200px">
      <div class="text-center bg-primary rd-32px p-64px shadow-high relative overflow-hidden group">
        <div
          class="absolute top-0 right-0 size-300px bg-white/10 rd-full -mr-150px -mt-150px blur-3xl transition-transform duration-700 group-hover:scale-125"
        />
        <div
          class="absolute bottom-0 left-0 size-300px bg-white/10 rd-full -ml-150px -mb-150px blur-3xl transition-transform duration-700 group-hover:scale-125"
        />

        <h2 class="text-36px font-bold text-white relative z-10">{{ $t('page.home.readyToStart') }}</h2>
        <p class="mt-16px text-18px text-white/80 max-w-600px mx-auto relative z-10">
          {{ $t('page.home.readyToStartDesc') }}
        </p>
        <div class="flex items-center justify-center mt-40px gap-16px relative z-10">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--uno-colors-blue-50), var(--uno-colors-indigo-100));
}

.dark .bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--uno-colors-gray-900), var(--uno-colors-gray-800));
}

.text-primary {
  color: var(--primary-color);
}
</style>

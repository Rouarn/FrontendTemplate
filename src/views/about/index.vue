<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { $t } from '@/locales'
import pkg from '~/package.json'

const appStore = useAppStore()

const column = computed(() => (appStore.isMobile ? 1 : 2))

interface PkgJson {
  name: string
  version: string
  dependencies: PkgVersionInfo[]
  devDependencies: PkgVersionInfo[]
}

interface PkgVersionInfo {
  name: string
  version: string
}

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple
  return {
    name: $name,
    version: $version,
  }
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map((item) => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map((item) => transformVersionData(item)),
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:info-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">{{ $t('page.about.title') }}</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            {{ $t('page.about.introduction') }}
          </p>
        </div>
      </div>
    </NCard>

    <!-- Project Info -->
    <NCard :title="$t('page.about.projectInfo.title')" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <NTag type="primary" round size="small" class="font-bold">{{ pkgJson.version }}</NTag>
      </template>
      <NDescriptions label-placement="left" :column="column" class="mt-8px">
        <NDescriptionsItem :label="$t('page.about.projectInfo.version')">
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ pkgJson.version }}</span>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ latestBuildTime }}</span>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a class="text-primary hover:underline flex items-center gap-4px" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            <SvgIcon icon="ph:github-logo-duotone" />
            GitHub
          </a>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a class="text-primary hover:underline flex items-center gap-4px" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            <SvgIcon icon="ph:browser-duotone" />
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>

    <!-- Dependencies -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px">
      <NCard :title="$t('page.about.prdDep')" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header-extra>
          <NTag type="success" size="small" round>{{ pkgJson.dependencies.length }}</NTag>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-24px gap-y-12px">
          <div
            v-for="item in pkgJson.dependencies"
            :key="item.name"
            class="flex items-center justify-between py-8px border-b border-layout last:border-none"
          >
            <span class="text-14px font-medium text-slate-600 dark:text-slate-400">{{ item.name }}</span>
            <NTag :bordered="false" size="small" class="bg-primary/5 text-primary rd-4px font-mono">{{ item.version }}</NTag>
          </div>
        </div>
      </NCard>

      <NCard :title="$t('page.about.devDep')" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header-extra>
          <NTag type="warning" size="small" round>{{ pkgJson.devDependencies.length }}</NTag>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-24px gap-y-12px">
          <div
            v-for="item in pkgJson.devDependencies"
            :key="item.name"
            class="flex items-center justify-between py-8px border-b border-layout last:border-none"
          >
            <span class="text-14px font-medium text-slate-600 dark:text-slate-400">{{ item.name }}</span>
            <NTag :bordered="false" size="small" class="bg-amber-500/5 text-amber-600 rd-4px font-mono">{{ item.version }}</NTag>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>

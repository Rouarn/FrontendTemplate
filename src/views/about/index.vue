<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { $t } from '@/locales'

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

const pkgJson: PkgJson = {
  name: __APP_NAME__,
  version: __APP_VERSION__,
  dependencies: __APP_DEPS__,
  devDependencies: __APP_DEV_DEPS__,
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- 页头 -->
    <PageHeader
      icon="ph:info-duotone"
      :title="$t('page.about.title')"
      :description="$t('page.about.introduction')"
    />

    <!-- 项目信息 -->
    <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header>
        <span class="flex items-center gap-10px">
          <SvgIcon icon="ph:cube-duotone" class="text-21px text-primary" />
          {{ $t('page.about.projectInfo.title') }}
        </span>
      </template>
      <NDescriptions label-placement="left" :column="column" bordered class="mt-8px rd-12px">
        <NDescriptionsItem :label="$t('page.about.projectInfo.version')">
          <NTag type="primary" round size="small" class="font-bold">{{ pkgJson.version }}</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <NTag type="info" round size="small" class="font-bold">{{ latestBuildTime }}</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a
            class="flex items-center gap-6px text-primary hover:underline"
            :href="__APP_HOMEPAGE__"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SvgIcon icon="ph:github-logo-duotone" />
            GitHub
          </a>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a
            class="flex items-center gap-6px text-primary hover:underline"
            :href="__APP_WEBSITE__"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SvgIcon icon="ph:browser-duotone" />
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>

    <!-- 依赖信息 -->
    <div class="grid grid-cols-1 gap-16px md:grid-cols-2">
      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:package-duotone" class="text-21px text-primary" />
            {{ $t('page.about.prdDep') }}
          </span>
        </template>
        <template #header-extra>
          <NTag type="success" size="small" round>{{ pkgJson.dependencies.length }}</NTag>
        </template>
        <div class="grid grid-cols-1 gap-x-24px sm:grid-cols-2">
          <div
            v-for="item in pkgJson.dependencies"
            :key="item.name"
            class="group flex items-center justify-between gap-8px border-b border-layout py-10px transition-colors last:border-none hover:border-primary/30"
          >
            <span
              class="flex items-center gap-8px truncate text-14px font-medium text-slate-600 dark:text-slate-400"
            >
              <SvgIcon
                icon="ph:cube-duotone"
                class="shrink-0 text-14px text-primary/50 transition-colors group-hover:text-primary"
              />
              {{ item.name }}
            </span>
            <NTag
              :bordered="false"
              size="small"
              class="shrink-0 bg-primary/5 font-mono text-primary rd-4px"
            >
              {{ item.version }}
            </NTag>
          </div>
        </div>
      </NCard>

      <NCard :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <template #header>
          <span class="flex items-center gap-10px">
            <SvgIcon icon="ph:wrench-duotone" class="text-21px text-amber-500" />
            {{ $t('page.about.devDep') }}
          </span>
        </template>
        <template #header-extra>
          <NTag type="warning" size="small" round>{{ pkgJson.devDependencies.length }}</NTag>
        </template>
        <div class="grid grid-cols-1 gap-x-24px sm:grid-cols-2">
          <div
            v-for="item in pkgJson.devDependencies"
            :key="item.name"
            class="group flex items-center justify-between gap-8px border-b border-layout py-10px transition-colors last:border-none hover:border-amber-500/30"
          >
            <span
              class="flex items-center gap-8px truncate text-14px font-medium text-slate-600 dark:text-slate-400"
            >
              <SvgIcon
                icon="ph:cube-duotone"
                class="shrink-0 text-14px text-amber-500/50 transition-colors group-hover:text-amber-500"
              />
              {{ item.name }}
            </span>
            <NTag
              :bordered="false"
              size="small"
              class="shrink-0 bg-amber-500/5 font-mono text-amber-600 rd-4px"
            >
              {{ item.version }}
            </NTag>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>

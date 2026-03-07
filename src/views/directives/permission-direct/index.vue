<script setup lang="ts" name="permissionDirect">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useRole } from '@/hooks/auth/use-role'

const authStore = useAuthStore()
const { roleNames } = useRole()

const userRole = computed(() => {
  const list = roleNames.value
  if (list.includes('R_SUPER_ADMIN')) return 'admin'
  if (list.includes('R_EDITOR')) return 'editor'
  if (list.includes('R_USER')) return 'user'
  return 'guest'
})

const currentPermissions = computed(() => {
  const names = roleNames.value
  const permissions = new Set<string>()
  if (names.includes('R_SUPER_ADMIN')) {
    permissions.add('admin')
    permissions.add('editor')
    permissions.add('user')
  }
  if (names.includes('R_EDITOR')) {
    permissions.add('editor')
    permissions.add('user')
  }
  if (names.includes('R_USER')) {
    permissions.add('user')
  }
  return Array.from(permissions)
})

const switchRole = (role: string) => {
  let nextRoles: Api.Auth.Role[] = []
  if (role === 'admin') {
    nextRoles = [{ id: '', name: 'R_SUPER_ADMIN', alias: '超级管理员', isSystem: true }]
  } else if (role === 'editor') {
    nextRoles = [{ id: '', name: 'R_EDITOR', alias: '编辑者', isSystem: true }]
  } else if (role === 'user') {
    nextRoles = [{ id: '', name: 'R_USER', alias: '普通用户', isSystem: true }]
  }
  authStore.setUserInfo({ ...authStore.userInfo, roles: nextRoles })
}
</script>

<template>
  <div class="flex-col gap-16px">
    <!-- Header Card -->
    <NCard :bordered="false" class="card-wrapper overflow-hidden">
      <div class="flex items-center gap-24px">
        <div class="size-80px flex-center bg-primary/10 rd-20px text-primary shadow-low">
          <SvgIcon icon="ph:shield-star-duotone" class="text-40px" />
        </div>
        <div class="flex-1">
          <h1 class="text-24px font-bold text-base-text">权限指令 `v-role` / `v-permission`</h1>
          <p class="mt-8px text-16px text-slate-500 leading-relaxed">
            基于 RBAC 模型，通过指令细粒度控制页面元素的显示与隐藏，确保敏感操作仅对授权用户开放
          </p>
        </div>
      </div>
    </NCard>

    <!-- User Status -->
    <NCard title="👤 当前用户鉴权状态" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <template #header-extra>
        <div class="flex items-center gap-12px">
          <span class="text-12px text-slate-400 font-medium">模拟角色切换：</span>
          <NButtonGroup size="small">
            <NButton @click="switchRole('guest')" :type="userRole === 'guest' ? 'primary' : 'default'">访客</NButton>
            <NButton @click="switchRole('user')" :type="userRole === 'user' ? 'primary' : 'default'">用户</NButton>
            <NButton @click="switchRole('editor')" :type="userRole === 'editor' ? 'primary' : 'default'">编辑</NButton>
            <NButton @click="switchRole('admin')" :type="userRole === 'admin' ? 'primary' : 'default'">管理</NButton>
          </NButtonGroup>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-24px py-8px">
        <div class="p-20px rd-16px bg-layout border border-primary/5 flex items-center gap-20px">
          <div class="size-56px flex-center bg-primary/10 text-primary rd-full">
            <SvgIcon icon="ph:user-circle-gear-duotone" class="text-32px" />
          </div>
          <div>
            <p class="text-12px text-slate-400 font-bold uppercase tracking-wider mb-4px">当前活跃角色</p>
            <NTag
              :type="userRole === 'admin' ? 'error' : userRole === 'editor' ? 'warning' : 'primary'"
              round
              size="small"
              class="font-bold"
            >
              {{ userRole.toUpperCase() }}
            </NTag>
          </div>
        </div>

        <div class="p-20px rd-16px bg-layout border border-primary/5 flex items-center gap-20px">
          <div class="size-56px flex-center bg-blue-500/10 text-blue-500 rd-full">
            <SvgIcon icon="ph:key-duotone" class="text-32px" />
          </div>
          <div>
            <p class="text-12px text-slate-400 font-bold uppercase tracking-wider mb-4px">拥有权限清单</p>
            <div class="flex flex-wrap gap-8px">
              <NTag v-for="p in currentPermissions" :key="p" type="info" size="small" round class="font-mono">
                {{ p }}
              </NTag>
              <span v-if="!currentPermissions.length" class="text-13px text-slate-400 italic">暂无权限</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Playground -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16px">
      <!-- Role Control -->
      <NCard title="🔐 角色控制 (v-role)" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">根据用户的 Role 属性进行简单的可见性控制。</p>
          <div class="flex flex-col gap-12px">
            <div v-role="'R_SUPER_ADMIN'" class="p-16px rd-12px bg-error/5 border border-error/10 flex items-center justify-between">
              <span class="text-14px font-bold text-error">删除敏感数据</span>
              <NTag type="error" size="tiny" round>仅管理员可见</NTag>
            </div>
            <div v-role="'R_EDITOR'" class="p-16px rd-12px bg-warning/5 border border-warning/10 flex items-center justify-between">
              <span class="text-14px font-bold text-warning">编辑文章内容</span>
              <NTag type="warning" size="tiny" round>编辑者以上可见</NTag>
            </div>
            <div v-role="'R_USER'" class="p-16px rd-12px bg-primary/5 border border-primary/10 flex items-center justify-between">
              <span class="text-14px font-bold text-primary">查看基础报表</span>
              <NTag type="primary" size="tiny" round>普通用户可见</NTag>
            </div>
          </div>
        </div>
      </NCard>

      <!-- Permission Control -->
      <NCard title="🛡️ 权限点控制 (v-permission)" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
        <div class="flex-col gap-16px">
          <p class="text-14px text-slate-500">更灵活的权限控制，支持数组判定（满足其一即可）。</p>
          <div class="flex flex-wrap gap-12px py-8px">
            <NButton v-permission="'admin'" type="error" ghost>管理按钮</NButton>
            <NButton v-permission="'editor'" type="warning" ghost>编辑按钮</NButton>
            <NButton v-permission="['admin', 'editor']" type="info" ghost>管理或编辑</NButton>
            <NButton v-permission="'user'" type="primary" ghost>用户按钮</NButton>
          </div>
          <div class="p-16px rd-12px bg-slate-100 dark:bg-slate-800 text-center italic text-12px text-slate-400">
            如果您看不到某些按钮，说明当前模拟角色不具备相应权限点
          </div>
        </div>
      </NCard>
    </div>

    <!-- Guide -->
    <NCard title="💡 代码实现" :bordered="false" class="card-wrapper" header-style="font-bold text-18px">
      <div class="p-16px rd-12px bg-layout border border-primary/10">
        <pre class="text-13px font-mono text-primary leading-relaxed overflow-x-auto"><code>&lt;!-- 角色判定 --&gt;
&lt;div v-role="'R_SUPER_ADMIN'"&gt;仅超级管理员显示&lt;/div&gt;

&lt;!-- 权限判定 (支持数组) --&gt;
&lt;NButton v-permission="['user_add', 'user_edit']"&gt;新增/编辑用户&lt;/NButton&gt;</code></pre>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>

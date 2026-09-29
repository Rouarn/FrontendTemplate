<script setup lang="ts">
import { ref } from 'vue'
import PasswordChange from './components/password-change.vue'
import UserEditForm from './components/user-edit-form.vue'
import UserProfileCard from './components/user-profile-card.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { createUserForm } from './shared'
import { $t } from '@/locales'

defineOptions({
  name: 'UserCenter',
})

const authStore = useAuthStore()

// 表单数据：父组件持有（ref），经 v-model:form 与 UserEditForm 双向同步，
// 头像/昵称同时供 UserProfileCard 展示
const userForm = ref(createUserForm())
const isEditing = ref(false)
const activeTab = ref('profile')

/** 头像上传中/成功：同步本地表单头像字段（远端持久化见 onAvatarUploaded） */
function onAvatarUpdate(url: string) {
  userForm.value.avatar = url
}

/** 头像上传成功：持久化到 authStore，保证后续保存表单与全局态一致 */
function onAvatarUploaded(url: string) {
  authStore.setUserInfo({
    ...authStore.userInfo,
    avatar: url,
  })
}
</script>

<template>
  <div class="p-16px lg:p-24px bg-layout min-h-full">
    <div class="max-w-1200px mx-auto grid grid-cols-1 lg:grid-cols-4 gap-24px">
      <!-- 左栏：用户概览（头像上传、角色、登录统计） -->
      <div class="lg:col-span-1 space-y-24px">
        <UserProfileCard
          :avatar="userForm.avatar"
          :nickname="userForm.nickname"
          :editable="isEditing"
          @update:avatar="onAvatarUpdate"
          @uploaded="onAvatarUploaded"
        />
      </div>

      <!-- 右栏：主要内容（资料编辑 / 修改密码） -->
      <div class="lg:col-span-3">
        <NCard :bordered="false" class="card-wrapper min-h-600px">
          <NTabs v-model:value="activeTab" type="line" animated justify-content="start" class="user-tabs">
            <NTabPane name="profile" :tab="$t('userCenter.profile')">
              <UserEditForm v-model:form="userForm" v-model:editable="isEditing" />
            </NTabPane>

            <NTabPane name="security" :tab="$t('userCenter.security')">
              <PasswordChange />
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

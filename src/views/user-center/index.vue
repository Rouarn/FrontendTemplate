<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import CroppingImage from '@/components/custom/cropping-image.vue'
import chinaCitys from '@/assets/json/china-citys.json'
import { changePassword, updateUserInfo, uploadAvatar } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'UserCenter',
})

const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)
const isEditing = ref(false)
const activeTab = ref('profile')
const saving = ref(false)
const changingPassword = ref(false)

function normalizeGender(input: unknown): 0 | 1 | 2 {
  const n = Number(input)
  return n === 0 || n === 1 || n === 2 ? (n as 0 | 1 | 2) : 2
}

function getInitialUserForm() {
  return {
    nickname: authStore.userInfo.nickname || '用户',
    avatar: authStore.userInfo.avatar || '',
    gender: normalizeGender(authStore.userInfo.gender),
    mobile: authStore.userInfo.mobile || '',
    email: authStore.userInfo.email || '',
    bio: authStore.userInfo.bio || '',
    birthday: authStore.userInfo.birthday ? new Date(authStore.userInfo.birthday).getTime() : null,
    city: authStore.userInfo.city || '',
    profession: authStore.userInfo.profession || '',
  }
}

const userForm = reactive(getInitialUserForm())

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 性别选项
const genderOptions = [
  { label: '男性', value: 0 },
  { label: '女性', value: 1 },
  { label: '保密', value: 2 },
] as const

// 城市选项
const cityOptions = chinaCitys.map((p) => ({
  label: p.province,
  value: p.province,
  children: p.citys.map((c) => ({
    label: c.city,
    value: `${p.province}/${c.city}`,
    children: c.areas.map((a) => ({
      label: a.area,
      value: `${p.province}/${c.city}/${a.area}`,
    })),
  })),
}))

// 表单验证规则
const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为 2-20 个字符', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  bio: [{ max: 200, message: '个人简介最多 200 个字符', trigger: 'blur' }],
}

// 密码验证规则
const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码最少 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        return value === passwordForm.newPassword
      },
      message: '两次密码输入不一致',
      trigger: 'blur',
    },
  ],
}

// 计算属性
const userRoleName = computed(() => {
  const roles = authStore.userInfo.roles
  if (Array.isArray(roles) && roles.length > 0) {
    return roles.map((r) => r.alias).join(' / ')
  }
  return '普通用户'
})

const statusText = computed(() => {
  return authStore.userInfo.auth.status === 1 ? '正常' : '禁用'
})

const statusType = computed(() => {
  return authStore.userInfo.auth.status === 1 ? 'success' : 'error'
})

// 方法
function handleEdit() {
  isEditing.value = true
}

function handleCancel() {
  isEditing.value = false
  // 重置表单数据
  Object.assign(userForm, getInitialUserForm())
}

async function handleSave() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 处理生日数据
    const saveData = {
      ...userForm,
      birthday: userForm.birthday ? new Date(userForm.birthday).toISOString().split('T')[0] : '',
      gender: Number(userForm.gender) as 0 | 1 | 2,
    }

    // 调用更新用户信息的 API
    saving.value = true
    const { error } = await updateUserInfo(authStore.userInfo.id, saveData)
    if (error) return

    // 更新本地状态
    authStore.setUserInfo({
      ...authStore.userInfo,
      ...saveData,
    })

    isEditing.value = false
    window.$message?.success('保存成功')
  } finally {
    saving.value = false
  }
}

async function handlePasswordChange() {
  try {
    await passwordFormRef.value?.validate()
    changingPassword.value = true
    const result = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    })

    if (!result.error) {
      Object.assign(passwordForm, {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      window.$message?.success(result.data?.message || '密码修改成功')
      await authStore.resetStore()
    }
  } catch (_) {
    window.$message?.error('密码修改失败，请检查当前密码是否正确')
  } finally {
    changingPassword.value = false
  }
}

// 头像上传
const cutterRef = ref<InstanceType<typeof CroppingImage> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleAvatarClick() {
  fileInputRef.value?.click()
}

function onAvatarFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return
  cutterRef.value?.openCropper()
  nextTick(() => cutterRef.value?.setImage(f))
  // 重置 input，以便再次选择相同文件时能够触发 change 事件
  target.value = ''
}

async function onCropDone(payload: { blob?: Blob; fileName?: string }) {
  if (!payload.blob) return
  const type = payload.blob.type || 'image/jpeg'
  const name = `avatar_${authStore.userInfo.id}_${userForm.nickname || 'user'}_${Date.now()}.${type.split('/')[1] || 'jpeg'}`
  const file = new File([payload.blob], name, { type })

  userForm.avatar = URL.createObjectURL(payload.blob)
  try {
    const res = await uploadAvatar(file)
    if (res.data && res.data.completeUrl) {
      userForm.avatar = res.data.completeUrl
      authStore.setUserInfo({
        ...authStore.userInfo,
        avatar: res.data.completeUrl,
      })
      window.$message?.success('头像上传成功')
    }
  } catch (_) {
    window.$message?.error('头像上传失败，请重试')
  } finally {
    cutterRef.value?.closeCropper()
    cutterRef.value?.clearImage()
  }
}
function onCropError(msg: string) {
  window.$message?.error(msg)
}

// 格式化日期
function formatDate(dateStr?: string | Date) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
}
</script>

<template>
  <div class="p-16px lg:p-24px bg-layout min-h-full">
    <div class="max-w-1200px mx-auto grid grid-cols-1 lg:grid-cols-4 gap-24px">
      <!-- 左栏：用户概览 -->
      <div class="lg:col-span-1 space-y-24px">
        <NCard :bordered="false" class="card-wrapper text-center overflow-hidden">
          <div class="relative pt-24px pb-32px">
            <div class="absolute top-0 left-0 w-full h-80px bg-primary/10" />
            <div class="relative flex-center flex-col gap-16px z-10">
              <div class="relative group size-100px">
                <NAvatar
                  :size="100"
                  round
                  object-fit="cover"
                  :src="userForm.avatar || 'http://static.shixian.xyz/photo'"
                  fallback-src=""
                  class="shadow-high ring-4 ring-white dark:ring-slate-800 transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  v-if="isEditing"
                  class="absolute inset-0 flex-center bg-black/40 rd-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 cursor-pointer"
                  @click="handleAvatarClick"
                >
                  <SvgIcon icon="ph:camera-duotone" class="text-24px text-white" />
                </div>
              </div>
              <div class="space-y-4px">
                <h3 class="text-20px font-bold text-base-text">{{ userForm.nickname }}</h3>
                <p class="text-14px text-slate-500 font-medium">@{{ authStore.userInfo.auth.username }}</p>
                <NTag :type="statusType" size="small" round class="mt-4px font-bold px-12px">{{ statusText }}</NTag>
              </div>
            </div>
          </div>

          <div class="border-t border-layout pt-24px space-y-16px text-left">
            <div class="flex justify-between items-center">
              <span class="text-14px text-slate-500 font-medium">角色权限</span>
              <NTag type="primary" size="small" round class="font-bold">{{ userRoleName }}</NTag>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-14px text-slate-500 font-medium">用户 ID</span>
              <span
                class="text-12px text-slate-400 font-mono bg-layout px-8px py-2px rd-4px truncate max-w-120px"
                :title="authStore.userInfo.id"
              >
                {{ authStore.userInfo.id }}
              </span>
            </div>
          </div>
        </NCard>

        <!-- Login Stats -->
        <NCard :bordered="false" class="card-wrapper" title="账号动态">
          <template #header-extra>
            <SvgIcon icon="ph:chart-line-up-duotone" class="text-18px text-primary" />
          </template>
          <div class="space-y-16px">
            <div class="flex items-center gap-12px">
              <div class="size-32px flex-center bg-blue-500/10 text-blue-500 rd-8px">
                <SvgIcon icon="ph:clock-duotone" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-12px text-slate-400">最后登录时间</p>
                <p class="text-13px font-medium text-slate-700 dark:text-slate-300 truncate">
                  {{ formatDate(authStore.userInfo.auth.lastLoginAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-12px">
              <div class="size-32px flex-center bg-amber-500/10 text-amber-500 rd-8px">
                <SvgIcon icon="ph:map-pin-duotone" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-12px text-slate-400">最后登录 IP</p>
                <p class="text-13px font-medium text-slate-700 dark:text-slate-300 font-mono">
                  {{ authStore.userInfo.auth.lastLoginIp || '未知' }}
                </p>
              </div>
            </div>
          </div>
        </NCard>
      </div>

      <!-- 右栏：主要内容 -->
      <div class="lg:col-span-3">
        <NCard :bordered="false" class="card-wrapper min-h-600px">
          <NTabs v-model:value="activeTab" type="line" animated justify-content="start" class="user-tabs">
            <NTabPane name="profile" tab="个人档案">
              <div class="flex justify-between items-center mb-32px mt-8px">
                <div class="flex items-center gap-8px">
                  <div class="w-4px h-20px bg-primary rd-full" />
                  <h2 class="text-18px font-bold text-base-text">基本资料</h2>
                </div>
                <div class="flex gap-12px">
                  <NButton v-if="!isEditing" type="primary" secondary strong class="rd-8px" @click="handleEdit">
                    <template #icon><SvgIcon icon="ph:pencil-simple-line-duotone" /></template>
                    编辑资料
                  </NButton>
                  <template v-else>
                    <NButton class="rd-8px" @click="handleCancel" :disabled="saving">取消</NButton>
                    <NButton type="primary" strong class="rd-8px shadow-low" @click="handleSave" :loading="saving">
                      <template #icon><SvgIcon icon="ph:check-circle-duotone" /></template>
                      保存更改
                    </NButton>
                  </template>
                </div>
              </div>

              <NForm
                ref="formRef"
                :model="userForm"
                :rules="rules"
                label-placement="top"
                :disabled="!isEditing"
                class="grid grid-cols-1 md:grid-cols-2 gap-x-32px gap-y-8px"
              >
                <NFormItem label="显示昵称" path="nickname">
                  <NInput v-model:value="userForm.nickname" placeholder="想一个响亮的名字" class="rd-8px" />
                </NFormItem>

                <NFormItem label="性别选择" path="gender">
                  <NRadioGroup v-model:value="userForm.gender" class="flex items-center">
                    <NSpace :size="24">
                      <NRadio v-for="option in genderOptions" :key="option.value" :value="option.value" class="font-medium">
                        {{ option.label }}
                      </NRadio>
                    </NSpace>
                  </NRadioGroup>
                </NFormItem>

                <NFormItem label="手机号码" path="mobile">
                  <NInput v-model:value="userForm.mobile" placeholder="用于账号通知" class="rd-8px" />
                </NFormItem>

                <NFormItem label="电子邮箱" path="email">
                  <NInput v-model:value="userForm.email" placeholder="用于安全验证" class="rd-8px" />
                </NFormItem>

                <NFormItem label="出生日期" path="birthday">
                  <NDatePicker v-model:value="userForm.birthday" type="date" placeholder="选择你的生日" class="w-full rd-8px" clearable />
                </NFormItem>

                <NFormItem label="现居城市" path="city">
                  <NCascader
                    v-model:value="userForm.city"
                    :options="cityOptions"
                    check-strategy="child"
                    placeholder="请选择城市"
                    class="rd-8px"
                    clearable
                    filterable
                  />
                </NFormItem>

                <NFormItem label="个人简介" path="bio" class="md:col-span-2">
                  <NInput
                    v-model:value="userForm.bio"
                    type="textarea"
                    placeholder="介绍一下你自己..."
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    class="rd-12px p-12px"
                  />
                </NFormItem>
              </NForm>
            </NTabPane>

            <NTabPane name="security" tab="安全设置">
              <div class="max-w-480px mx-auto pt-32px">
                <div class="text-center mb-40px">
                  <div class="size-64px flex-center bg-amber-500/10 text-amber-500 rd-24px mx-auto mb-16px">
                    <SvgIcon icon="ph:shield-check-duotone" class="text-32px" />
                  </div>
                  <h2 class="text-20px font-bold text-base-text">修改登录密码</h2>
                  <p class="text-14px text-slate-500 mt-8px">建议定期更换密码以保障账号安全</p>
                </div>

                <NForm ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="top">
                  <NFormItem label="当前密码" path="oldPassword">
                    <NInput
                      v-model:value="passwordForm.oldPassword"
                      type="password"
                      show-password-on="click"
                      placeholder="输入现有密码"
                      class="rd-8px"
                    />
                  </NFormItem>
                  <NFormItem label="新密码" path="newPassword">
                    <NInput
                      v-model:value="passwordForm.newPassword"
                      type="password"
                      show-password-on="click"
                      placeholder="设置新密码 (不少于6位)"
                      class="rd-8px"
                    />
                  </NFormItem>
                  <NFormItem label="确认新密码" path="confirmPassword">
                    <NInput
                      v-model:value="passwordForm.confirmPassword"
                      type="password"
                      show-password-on="click"
                      placeholder="再次输入新密码"
                      class="rd-8px"
                    />
                  </NFormItem>
                  <div class="pt-16px">
                    <NButton
                      type="primary"
                      block
                      strong
                      size="large"
                      class="rd-12px text-16px shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
                      @click="handlePasswordChange"
                      :loading="changingPassword"
                    >
                      确认修改
                    </NButton>
                  </div>
                </NForm>
              </div>
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    </div>
    <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileChange" />
    <CroppingImage ref="cutterRef" cropper-title="裁剪头像" :mask-closable="false" @done="onCropDone" @error="onCropError" />
  </div>
</template>

<style lang="scss" scoped>
.user-center-container {
  min-height: calc(100vh - 160px);
}

// 卡片阴影效果
:deep(.n-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

// 头像相关的样式
:deep(.n-avatar) {
  width: 100px;
  height: 100px;
}

// 默认头像样式
.default-avatar {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// 表单样式优化
:deep(.n-form-item-label) {
  font-weight: 500;
  color: #374151;
}

// 按钮样式优化
:deep(.n-button) {
  border-radius: 8px;
}

// 标签页样式
:deep(.n-tabs-nav) {
  padding: 0 16px;
}

:deep(.n-tabs-tab) {
  font-weight: 500;
}

// 头像上传按钮
:deep(.n-upload) {
  width: auto;
}

// 响应式设计
@media (max-width: 768px) {
  .user-center-container {
    padding: 1rem;
  }

  :deep(.n-form-item) {
    margin-bottom: 16px;
  }
}

.hover-avatar {
  position: relative;
  display: inline-block;

  &:hover::after {
    content: '点击上传';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.4);
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 12px 12px;
    color: white;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 12px;
    pointer-events: none;
  }
}

:deep(.n-upload-trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-upload-trigger.n-upload-trigger--disabled) {
  opacity: 1;
}
</style>

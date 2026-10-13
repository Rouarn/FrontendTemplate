<script setup lang="ts">
import { computed, ref } from 'vue'
import chinaCitys from '@/assets/json/china-citys.json'
import { updateUserInfo } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { createUserForm, type UserForm } from '../shared'
import { $t } from '@/locales'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'UserEditForm',
})

/** 父组件持有的表单数据（同一对象，经 defineModel 双向同步，避免 prop 变更告警） */
const form = defineModel<UserForm>('form', { required: true })
/** 是否处于编辑态（v-model） */
const editable = defineModel<boolean>('editable', { default: false })

const emit = defineEmits<{
  saved: []
}>()

const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const saving = ref(false)

// 性别选项
const genderOptions = computed(() => [
  { label: $t('userCenter.genderMale'), value: 0 },
  { label: $t('userCenter.genderFemale'), value: 1 },
  { label: $t('userCenter.genderUnknown'), value: 2 },
])

// 城市选项：懒构造 + 缓存，避免 setup 顶层一次性构造上千级联项拖慢首屏
const cityOptions = computed(() =>
  chinaCitys.map((p) => ({
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
  })),
)

// 表单验证规则
const rules = computed<FormRules>(() => ({
  nickname: [
    { required: true, message: $t('userCenter.nicknameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: $t('userCenter.nicknameLength'), trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: $t('userCenter.mobileRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: $t('userCenter.mobileInvalid'), trigger: 'blur' },
  ],
  email: [{ type: 'email', message: $t('userCenter.emailInvalid'), trigger: 'blur' }],
  bio: [{ max: 200, message: $t('userCenter.bioMaxLength'), trigger: 'blur' }],
}))

function handleEdit() {
  editable.value = true
}

function handleCancel() {
  editable.value = false
  // 重置表单数据
  Object.assign(form.value, createUserForm())
}

async function handleSave() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 处理生日数据
    const saveData = {
      ...form.value,
      birthday: form.value.birthday
        ? new Date(form.value.birthday).toISOString().split('T')[0]
        : '',
      gender: Number(form.value.gender) as 0 | 1 | 2,
    }

    // 调用更新用户信息的 API
    saving.value = true
    await updateUserInfo(authStore.userInfo.id, saveData)

    // 更新本地状态
    authStore.setUserInfo({
      ...authStore.userInfo,
      ...saveData,
    })

    editable.value = false
    emit('saved')
    window.$message?.success($t('userCenter.saveSuccess'))
  } catch {
    // 表单校验失败或请求失败（请求失败提示由全局 onError 处理）
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-32px mt-8px">
      <div class="flex items-center gap-8px">
        <div class="w-4px h-20px bg-primary rd-full" />
        <h2 class="text-18px font-bold text-base-text">{{ $t('userCenter.basicInfo') }}</h2>
      </div>
      <div class="flex gap-12px">
        <NButton
          v-if="!editable"
          type="primary"
          secondary
          strong
          class="rd-8px"
          @click="handleEdit"
        >
          <template #icon><SvgIcon icon="ph:pencil-simple-line-duotone" /></template>
          {{ $t('userCenter.editProfile') }}
        </NButton>
        <template v-else>
          <NButton class="rd-8px" @click="handleCancel" :disabled="saving">{{
            $t('userCenter.cancel')
          }}</NButton>
          <NButton
            type="primary"
            strong
            class="rd-8px shadow-low"
            @click="handleSave"
            :loading="saving"
          >
            <template #icon><SvgIcon icon="ph:check-circle-duotone" /></template>
            {{ $t('userCenter.saveChanges') }}
          </NButton>
        </template>
      </div>
    </div>

    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="top"
      :disabled="!editable"
      class="grid grid-cols-1 md:grid-cols-2 gap-x-32px gap-y-8px"
    >
      <NFormItem :label="$t('userCenter.nickname')" path="nickname">
        <NInput
          v-model:value="form.nickname"
          :placeholder="$t('userCenter.nicknamePlaceholder')"
          class="rd-8px"
        />
      </NFormItem>

      <NFormItem :label="$t('userCenter.gender')" path="gender">
        <NRadioGroup v-model:value="form.gender" class="flex items-center">
          <NSpace :size="24">
            <NRadio
              v-for="option in genderOptions"
              :key="option.value"
              :value="option.value"
              class="font-medium"
            >
              {{ option.label }}
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </NFormItem>

      <NFormItem :label="$t('userCenter.mobile')" path="mobile">
        <NInput
          v-model:value="form.mobile"
          :placeholder="$t('userCenter.mobilePlaceholder')"
          class="rd-8px"
        />
      </NFormItem>

      <NFormItem :label="$t('userCenter.email')" path="email">
        <NInput
          v-model:value="form.email"
          :placeholder="$t('userCenter.emailPlaceholder')"
          class="rd-8px"
        />
      </NFormItem>

      <NFormItem :label="$t('userCenter.birthday')" path="birthday">
        <NDatePicker
          v-model:value="form.birthday"
          type="date"
          :placeholder="$t('userCenter.birthdayPlaceholder')"
          class="w-full rd-8px"
          clearable
        />
      </NFormItem>

      <NFormItem :label="$t('userCenter.city')" path="city">
        <NCascader
          v-model:value="form.city"
          :options="cityOptions"
          check-strategy="child"
          :placeholder="$t('userCenter.cityPlaceholder')"
          class="rd-8px"
          clearable
          filterable
        />
      </NFormItem>

      <NFormItem :label="$t('userCenter.bio')" path="bio" class="md:col-span-2">
        <NInput
          v-model:value="form.bio"
          type="textarea"
          :placeholder="$t('userCenter.bioPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 5 }"
          class="rd-12px p-12px"
        />
      </NFormItem>
    </NForm>
  </div>
</template>

<style scoped></style>

import { useAuthStore } from '@/stores/modules/auth'

/** 用户中心编辑表单结构 */
export interface UserForm {
  nickname: string
  avatar: string
  gender: 0 | 1 | 2
  mobile: string
  email: string
  bio: string
  birthday: number | null
  city: string
  profession: string
}

function normalizeGender(input: unknown): 0 | 1 | 2 {
  const n = Number(input)
  return n === 0 || n === 1 || n === 2 ? (n as 0 | 1 | 2) : 2
}

/** 根据 authStore 当前用户信息构造表单初始值 */
export function createUserForm(): UserForm {
  const { userInfo } = useAuthStore()
  return {
    nickname: userInfo.nickname || '用户',
    avatar: userInfo.avatar || '',
    gender: normalizeGender(userInfo.gender),
    mobile: userInfo.mobile || '',
    email: userInfo.email || '',
    bio: userInfo.bio || '',
    birthday: userInfo.birthday ? new Date(userInfo.birthday).getTime() : null,
    city: userInfo.city || '',
    profession: userInfo.profession || '',
  }
}

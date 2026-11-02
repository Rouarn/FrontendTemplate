import { request } from '../request'

/** 获取用户列表（分页） */
export function fetchUserList(
  params?: Api.Common.PageParams & {
    nickname?: string
    email?: string
    status?: string
  },
) {
  return request.get<Api.Common.Paginated<Api.Auth.UserInfo>>('/api/users', params)
}

/** 获取用户详情 */
export function fetchUserDetail(userId: string) {
  return request.get<Api.Auth.UserInfo>(`/api/users/${userId}`)
}

/** 更新用户信息 */
export function updateUserInfo(userId: string, body: Partial<Api.Auth.UserInfo>) {
  return request.patch<Api.Auth.UserInfo>(`/api/users/${userId}`, body)
}

/** 删除用户 */
export function deleteUser(userId: string) {
  return request.delete(`/api/users/${userId}`)
}

/** 批量删除用户（后端返回实际删除与不存在的 ID） */
export function batchDeleteUsers(userIds: string[]) {
  return request.post<{ deleted: string[]; missing: string[] }>('/api/users/batch-delete', {
    ids: userIds,
  })
}

/** 切换用户状态 */
export function toggleUserStatus(userId: string, status: string) {
  return request.patch<Api.Auth.UserInfo>(`/api/users/${userId}/status`, { status })
}

/** 上传头像 */
export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('description', '用户头像')
  formData.append('isPublic', '1')
  return request.upload<{
    url: string
    completeUrl: string
  }>('/api/upload', formData)
}

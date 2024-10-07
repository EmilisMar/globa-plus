import type { AdminLoginT } from '../components/BuilderForm/schemas/auth.schema'
import { req } from '../providers/axios.provider'
import { useStateUser } from '../states/user.state'
import { login } from '../utils/auth.util'

import type { LoginResT, UserT } from './types/auth.api.type'

export const API_POST_AdminLogin = async (form: AdminLoginT) => {
	form = { ...form, email: form.email.toLowerCase() }
	const r = await req.post<LoginResT>(`/auth/login`, { admin: form })
	r && login(r)
	return r
}

export const API_POST_UserLogin = async (email: string) => {
	return await req.post(`/auth/login`, { user: { email: email.toLowerCase() } })
}

export const API_POST_UserLoginValidate = async (token: string) => {
	const r = await req.post<LoginResT>(`/auth/login`, { user: { token } })
	r && login(r)
	return r
}

export const API_PATCH_VerifyUser = async (userId?: string) => {
	if (!userId) return
	return await req.patch(`/admin/users/${userId}`)
}

export const API_GET_VerifyToken = async () => {
	const r = await req.get<UserT>(`/auth/token-verify`)
	r && useStateUser.getState().setUser(r)
	return r
}

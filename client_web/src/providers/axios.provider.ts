import type { AxiosError } from 'axios'
import axios, { isAxiosError } from 'axios'

import { toastErr } from '../components/Toast'
import { logout } from '../utils/auth.util'
import { getAccessToken } from '../utils/token.util'

import { Err } from './enums/err.enum'

declare module 'axios' {
	export interface AxiosResponse<T = any> extends Promise<T> {}
}

export const req = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: { 'Content-Type': 'application/json' },
})

req.interceptors.request.use(
	async (req) => {
		const token: any = await getAccessToken()
		if (token) req.headers.Authorization = token
		return req
	},
	(err) => {
		return err
	},
)

req.interceptors.response.use(
	(res) => {
		return res.data
	},
	async (err: Error | AxiosError) => {
		if (isAxiosError(err)) {
			if (err.response?.data.message === Err.TOKEN_INVALID) {
				logout()
			}
			if (err.response?.data.message === Err.UNOAUTH) {
				logout()
			}
			toastErr(err.response?.data.message)
			return err
		} else {
			return err.message
		}
	},
)

import type { LoginResT } from '../apis/types/auth.api.type'
import { useStateUser } from '../states/user.state'

import { delAccessToken, setAccessToken } from './token.util'

export const login = async (user: LoginResT) => {
	await setAccessToken(user.accessToken)
	useStateUser.getState().setUser(user.user)
}

export const logout = async () => {
	await delAccessToken()
	useStateUser.getState().setUser(null)
	window.location.href = '/'
}

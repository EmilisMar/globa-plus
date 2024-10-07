enum Token {
	AccessToken = 'access_token',
}

export const setAccessToken = async (val: string) => {
	localStorage.setItem(Token.AccessToken, val)
}

export const getAccessToken = async () => {
	return localStorage.getItem(Token.AccessToken)
}

export const delAccessToken = async () => {
	localStorage.removeItem(Token.AccessToken)
}

import { jwtVerify, SignJWT } from 'jose'

import type { UserRoleT } from '../db/tables/users.table'
import { Err } from '../enums/err.enum'

import { err } from './err.util'

const TK = new TextEncoder().encode(process.env.TOKEN_KEY)

export type AuthToken = { pid: string; role: UserRoleT }

export const signAuthToken = (payload: AuthToken) => {
	const token = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(TK)
	return token
}

export const verifyAuthToken = async (tArg: string | undefined) => {
	if (!tArg) throw err(401, Err.TOKEN_NULL)
	let token: AuthToken
	try {
		token = (await jwtVerify<AuthToken>(tArg, TK)).payload
	} catch (e) {
		throw err(401, Err.TOKEN_INVALID)
	}
	return token
}

export type EmailToken = { email: string; code: number }

export const signEmailLoginToken = (payload: EmailToken) => {
	const token = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(TK)
	return token
}

export const verifyEmailLoginToken = async (tArg: string | undefined) => {
	if (!tArg) throw err(401, Err.TOKEN_NULL)
	let token: EmailToken
	try {
		token = (await jwtVerify<EmailToken>(tArg, TK)).payload
	} catch (e) {
		throw err(401, Err.TOKEN_INVALID)
	}
	return token
}

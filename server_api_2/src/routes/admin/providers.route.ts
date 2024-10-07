import type { FastifyReply, FastifyRequest } from 'fastify'

import { genCode } from '@mariuzm/utils'
import { Type as t } from '@sinclair/typebox'

import { q_create_provider } from '../../db/queries/users_providers.query'
import { q_get_user } from '../../db/queries/users.query'
import { Err } from '../../enums/err.enum'
import { emailLogin } from '../../providers/nodemailer/funcs/emailLogin.func'
import { err } from '../../utils/err.util'
import { signEmailLoginToken } from '../../utils/token.util'

const createProviderS = {
	body: t.Object(
		{ companyName: t.String(), companyCode: t.String(), email: t.String() },
		{ additionalProperties: false },
	),
}

export type CreateProviderT = typeof createProviderS.body.static

export const createProvider = {
	schema: createProviderS,
	handler: async (req: FastifyRequest<{ Body: CreateProviderT }>, res: FastifyReply) => {
		const email = req.body.email
		const user = await q_get_user({ email })
		if (user) throw err(400, Err.EMAIL_ALREADY_EXISTS)
		const emailCode = genCode()
		await q_create_provider(req.body, emailCode, req.token.pid)
		const token = await signEmailLoginToken({ email: email, code: emailCode })
		emailLogin({ email, name: email, token })
		res.code(200).send('ok')
	},
}

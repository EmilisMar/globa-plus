import { genCode } from '@mariuzm/utils'
import { FormatRegistry, Type as t } from '@sinclair/typebox'
import { verify } from 'argon2'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { q_get_user } from '../../db/queries/users.query'
import { q_get_admin_from_email } from '../../db/queries/users_admins.query'
import {
	q_update_provider_email_code,
	q_verify_provider_from_code,
} from '../../db/queries/users_providers.query'
import {
	q_update_worker_email_code,
	q_verify_worker_from_code,
} from '../../db/queries/users_workers.query'
import { Err } from '../../enums/err.enum'
import { dbk } from '../../providers/kysely.provider'
import { emailLogin } from '../../providers/nodemailer/funcs/emailLogin.func'
import { err } from '../../utils/err.util'
import { signAuthToken, signEmailLoginToken, verifyEmailLoginToken } from '../../utils/token.util'

// ------------------------------------------------------------------

FormatRegistry.Set('email', (value) => {
	return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
		value,
	)
})

// ------------------------------------------------------------------

const loginS = {
	body: t.Object(
		{
			admin: t.Optional(
				t.Object(
					{
						email: t.String({ minLength: 1, maxLength: 50, format: 'email' }),
						password: t.String({ minLength: 1, maxLength: 50 }),
					},
					{ additionalProperties: false },
				),
			),
			user: t.Optional(
				t.Object(
					{
						email: t.Optional(t.String({ minLength: 1, maxLength: 50, format: 'email' })),
						token: t.Optional(t.String({ minLength: 1, maxLength: 500 })),
					},
					{ additionalProperties: false },
				),
			),
		},
		{ additionalProperties: false },
	),
}

export const login = {
	schema: loginS,
	handler: async (req: FastifyRequest<{ Body: typeof loginS.body.static }>, res: FastifyReply) => {
		const adminEmail = req.body.admin?.email
		const adminPass = req.body.admin?.password
		const userEmail = req.body.user?.email
		const userToken = req.body.user?.token

		if (adminEmail && adminPass) {
			const { password, ...user } = await q_get_admin_from_email(adminEmail)
			const isPasswordValid = await verify(password, adminPass)
			if (!isPasswordValid) throw err(404, Err.INVALID_PASSWORD)
			const accessToken = await signAuthToken({ pid: user.pid, role: 'admin' })
			res.code(200).send({ accessToken, user })
			return
		}

		if (userEmail) {
			const u = await q_get_user({ email: userEmail })
			if (!u) throw err(404)
			const emailCode = genCode()
			u.role === 'provider' && (await q_update_provider_email_code(u.pid, emailCode))
			u.role === 'worker' && (await q_update_worker_email_code(u.pid, emailCode))
			const token = await signEmailLoginToken({ email: userEmail, code: emailCode })
			emailLogin({ email: userEmail, name: userEmail, token })
			res.code(200).send('ok')
			return
		}

		if (userToken) {
			const t = await verifyEmailLoginToken(userToken)
			const p = await q_verify_provider_from_code(t.email, Number(t.code))
			if (p) {
				const accessToken = await signAuthToken({ pid: p.pid, role: p.role })
				res.code(200).send({ accessToken, user: p })
				return
			}

			const w = await q_verify_worker_from_code(t.email, Number(t.code))
			if (w) {
				const accessToken = await signAuthToken({ pid: w.pid, role: w.role })
				res.code(200).send({ accessToken, user: w })
				return
			}

			if (!p && !w) throw err(404)
		}
	},
}

// ------------------------------------------------------------------

export const verifyTokenRoute = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		const tables = {
			admin: 'users_admins',
			provider: 'users_providers',
			worker: 'users_workers',
		} as const
		const user = await dbk
			.selectFrom(tables[req.token.role])
			.where('pid', '=', req.token.pid)
			.selectAll()
			.executeTakeFirst()
		if (!user) throw err(401)
		const { id, password, ...restUser } = user
		res.code(200).send({ ...restUser, role: req.token.role })
	},
}

// ------------------------------------------------------------------

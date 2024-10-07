import type { FastifyReply, FastifyRequest } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_ap_create_service } from '../../db/queries/services.query'
import { q_a_get_admin_from_pid } from '../../db/queries/users_admins.query'

const createServiceS = {
	body: t.Object(
		{ name: t.String(), categoryPid: t.String(), time: t.String() },
		{ additionalProperties: false },
	),
}

export type CreateServiceT = typeof createServiceS.body.static

export const createService = {
	schema: createServiceS,
	handler: async (req: FastifyRequest<{ Body: CreateServiceT }>, res: FastifyReply) => {
		const tokenPid = req.token.pid
		await q_a_get_admin_from_pid(tokenPid)
		await q_ap_create_service(req.body, tokenPid)
		res.code(200).send('ok')
	},
}

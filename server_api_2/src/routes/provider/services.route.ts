import type { FastifyReply, FastifyRequest } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_ap_create_service, q_ap_get_services_t } from '../../db/queries/services.query'
import { q_p_get_admin } from '../../db/queries/users_admins.query'
import { q_get_provider } from '../../db/queries/users_providers.query'
import { err } from '../../utils/err.util'

export const pGetService = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		return res.code(200).send(await q_ap_get_services_t(req.token.pid))
	},
}

const PCreateServiceS = {
	body: t.Object(
		{ name: t.String(), categoryPid: t.String(), time: t.String() },
		{ additionalProperties: false },
	),
}

type PCreateServiceT = typeof PCreateServiceS.body.static

export const pCreateServices = {
	schema: PCreateServiceS,
	handler: async (req: FastifyRequest<{ Body: PCreateServiceT }>, res: FastifyReply) => {
		const tokenPid = req.token.pid
		let user: any
		const admin = await q_p_get_admin(tokenPid)
		if (admin) user = admin
		else user = await q_get_provider(tokenPid)
		if (!user) throw err(404)
		await q_ap_create_service(req.body, user.pid)
		res.code(200).send('ok')
	},
}

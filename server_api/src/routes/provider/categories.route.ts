import type { FastifyReply, FastifyRequest } from 'fastify'

import { q_ap_get_categories_t } from '../../db/queries/categories.query'

export const pGetCategories = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		return res.code(200).send(await q_ap_get_categories_t(req.token.pid))
	},
}

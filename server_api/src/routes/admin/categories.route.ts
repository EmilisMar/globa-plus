import type { FastifyReply } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_ap_create_category } from '../../db/queries/categories.query'
import type { FastReqT } from '../../types/fastify.type'

const CreateCategoryS = {
	body: t.Object({ categoryGroup: t.String(), name: t.String() }, { additionalProperties: false }),
}

export type CreateCategoryT = typeof CreateCategoryS.body.static

export const apCreateCategory = {
	schema: CreateCategoryS,
	handler: async (req: FastReqT<typeof CreateCategoryS>, res: FastifyReply) => {
		await q_ap_create_category(req.body, req.token.pid)
		res.code(200).send('ok')
	},
}

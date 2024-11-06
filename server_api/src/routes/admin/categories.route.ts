import type { FastifyReply } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_ap_create_category, q_ap_update_category, q_get_category_by_id } from '../../db/queries/categories.query'
import type { FastReqT } from '../../types/fastify.type'

export const GetCategoryS = {
	params: t.Object({ categoryPid: t.String() }, { additionalProperties: false }),
}
export type GetCategoryParamsT = typeof GetCategoryS.params.static

export const apGetCategory = {
	schema: GetCategoryS,
	handler: async (req: FastReqT<typeof GetCategoryS>, res: FastifyReply) => {
		const { categoryPid } = req.params
		const category = await q_get_category_by_id(categoryPid)
		if (!category) {
			res.code(404).send({ message: 'Category not found' })
		} else {
			res.code(200).send(category)
		}
	},
}


const EditCategoryS = {
	params: t.Object({ categoryPid: t.String() }, { additionalProperties: false }),
	body: t.Object({ categoryGroup: t.String(), name: t.String() }, { additionalProperties: false }),
}

export type EditCategoryT = typeof EditCategoryS.body.static

export const apUpdateCategory = {
	schema: EditCategoryS,
	handler: async (req: FastReqT<typeof EditCategoryS>, res: FastifyReply) => {
		const { categoryPid } = req.params
		const updatedCategory = await q_ap_update_category(req.body, categoryPid, req.token.pid)
		res.code(200).send(updatedCategory)
	},
}

export const CreateCategoryS = {
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

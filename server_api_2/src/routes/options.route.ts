import type { FastifyReply, FastifyRequest } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_p_get_categories_groups_opt } from '../db/queries/categories_groups.query'
import { q_get_categories_opt } from '../db/queries/categories.query'
import { q_get_recipients_opt } from '../db/queries/recipients.query'
import { q_get_users_opt } from '../db/queries/users.query'
import type { FastReqT } from '../types/fastify.type'
import { arrToObj } from '../utils/obj.util'

const TABLES = ['providers', 'recipients', 'workers', 'categories']

const getOptionsS = {
	params: t.Object({ tableName: t.Enum(arrToObj(TABLES)) }, { additionalProperties: false }),
}

export const getOptions = {
	schema: getOptionsS,
	handler: async (
		req: FastifyRequest<{ Params: typeof getOptionsS.params.static }>,
		res: FastifyReply,
	) => {
		switch (req.params.tableName) {
			case 'providers':
				return res.code(200).send(await q_get_users_opt('provider'))
			case 'recipients':
				return res.code(200).send(await q_get_recipients_opt())
			case 'workers':
				return res.code(200).send(await q_get_users_opt('worker'))
			case 'categories':
				return res.code(200).send(await q_get_categories_opt(req.token.pid))
		}
	},
}

const pGetOptionsS = {
	params: t.Object(
		{ entity: t.Enum(arrToObj(['categories_groups'])) },
		{ additionalProperties: false },
	),
}

export const pGetOptions = {
	schema: pGetOptionsS,
	handler: async (req: FastReqT<typeof pGetOptionsS>, res: FastifyReply) => {
		return res.code(200).send(await q_p_get_categories_groups_opt(req.token.pid))
	},
}

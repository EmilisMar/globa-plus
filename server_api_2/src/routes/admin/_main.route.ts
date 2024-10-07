import type { FastifyReply, FastifyRequest } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_ap_get_categories_t } from '../../db/queries/categories.query'
import {
	q_a_get_recipients_report_t,
	q_a_get_recipients_t,
} from '../../db/queries/recipients.query'
import { q_ap_get_services_t } from '../../db/queries/services.query'
import { q_get_providers_t } from '../../db/queries/users_providers.query'
import { arrToObj } from '../../utils/obj.util'

const TABLES = ['providers', 'recipients', 'categories', 'services', 'reports']

const getTableS = {
	params: t.Object({ tableName: t.Enum(arrToObj(TABLES)) }, { additionalProperties: false }),
	querystring: t.Object({ dateFrom: t.Optional(t.String()) }, { additionalProperties: false }),
}

export const getTable = {
	schema: getTableS,
	handler: async (
		req: FastifyRequest<{
			Params: typeof getTableS.params.static
			Querystring: typeof getTableS.querystring.static
		}>,
		res: FastifyReply,
	) => {
		switch (req.params.tableName) {
			case 'providers':
				return res.code(200).send(await q_get_providers_t())
			case 'recipients':
				return res.code(200).send(await q_a_get_recipients_t())
			case 'categories':
				return res.code(200).send(await q_ap_get_categories_t(req.token.pid))
			case 'services':
				return res.code(200).send(await q_ap_get_services_t(req.token.pid))
			case 'reports':
				return res
					.code(200)
					.send(await q_a_get_recipients_report_t({ dateFrom: req.query.dateFrom }))
		}
	},
}

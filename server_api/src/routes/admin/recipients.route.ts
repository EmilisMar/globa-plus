import type { FastifyReply, FastifyRequest } from 'fastify'
import { Type as t } from '@sinclair/typebox'

import { q_a_get_recipients_report_t, q_ap_create_recipient, q_p_get_recipients_report_t } from '../../db/queries/recipients.query'
import { ApproveByE } from '../../db/tables/recipients.table'
import { arrToObj } from '../../utils/obj.util'
import { FastReqT } from '../../types/fastify.type'

export const CreateRecipientS = {
	body: t.Object(
		{
			providerPid: t.String(),
			firstName: t.String(),
			lastName: t.String(),
			address: t.Optional(
				t.Object(
					{
						full_address: t.String(),
						adddress_line: t.String(),
						town: t.String(),
						postCode: t.String(),
						country: t.String(),
						latitude: t.Union([t.Number(), t.Null()]),
						longitude: t.Union([t.Number(), t.Null()]),
					},
					{ additionalProperties: false },
				),
			),
			phone: t.String(),
			notes: t.Optional(t.String()),
			hourlyRate: t.Number(),
			serviceGroups: t.Array(t.String()),
			approveBy: t.Enum(arrToObj(ApproveByE)),
			email: t.Optional(t.String({ format: 'email' })),
		},
		{ additionalProperties: false },
	),
}

export type CreateRecipientT = typeof CreateRecipientS.body.static

export const createRecipient = {
	schema: CreateRecipientS,
	handler: async (req: FastifyRequest<{ Body: CreateRecipientT }>, res: FastifyReply) => {
		await q_ap_create_recipient(req.body, req.token.pid)
		res.code(200).send('ok')
	},
}

export const GetReportsS = {
	querystring: t.Object(
		{
			dateFrom: t.Optional(t.String()),
			dateEnd: t.Optional(t.String()),
		},
		{ additionalProperties: false },
	),
};

export const getReports = {
	schema: GetReportsS,
	handler: async (req: FastReqT<typeof GetReportsS>, res: FastifyReply) => {
		res.code(200).send(
			await q_a_get_recipients_report_t({
				dateFrom: req.query.dateFrom,
				dateEnd: req.query.dateEnd,
			}),
		)
	},
}

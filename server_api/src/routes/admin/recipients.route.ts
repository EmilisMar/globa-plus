import type { FastifyReply, FastifyRequest } from 'fastify'
import { Type as t } from '@sinclair/typebox'

import { q_ap_create_recipient } from '../../db/queries/recipients.query'
import { ApproveByE } from '../../db/tables/recipients.table'
import { arrToObj } from '../../utils/obj.util'

export const CreateRecipientS = {
	body: t.Object(
		{
			providerPid: t.String(),
			firstName: t.String(),
			lastName: t.String(),
			address: t.Optional(
				t.Object(
					{
						adddress_line: t.String(),
						town: t.String(),
						postCode: t.String(),
						country: t.String(),
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

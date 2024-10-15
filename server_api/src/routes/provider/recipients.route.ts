import type { FastifyReply, FastifyRequest } from 'fastify'
import { Type as t } from '@sinclair/typebox'

import {
	q_a_get_recipients_with_admins_t,
	q_ap_create_recipient,
	q_p_edit_recipient,
	q_p_get_recipient,
	q_p_get_recipients_report_t,
} from '../../db/queries/recipients.query'
import { ApproveByE } from '../../db/tables/recipients.table'
import type { FastReqT } from '../../types/fastify.type'
import { err } from '../../utils/err.util'
import { arrToObj } from '../../utils/obj.util'
import { CreateRecipientS } from '../admin/recipients.route'

const GetRecipientS = {
	params: t.Object({ recipientPid: t.String() }, { additionalProperties: false }),
}

export type GetRecipientT = typeof GetRecipientS.params.static

export const pGetRecipient = {
	schema: GetRecipientS,
	handler: async (req: FastReqT<typeof GetRecipientS>, res: FastifyReply) => {
		res.code(200).send(await q_p_get_recipient(req.params.recipientPid))
	},
}

export const pGetRecipients = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		res.code(200).send(await q_a_get_recipients_with_admins_t(req.token.pid))
	},
}

export const pCreateRecipient = {
	schema: CreateRecipientS,
	handler: async (req: FastReqT<typeof CreateRecipientS>, res: FastifyReply) => {
		if (req.body.providerPid !== req.token.pid) throw err(403)
		await q_ap_create_recipient(req.body, req.token.pid)
		res.code(200).send('ok')
	},
}

export const EditRecipientS = {
	params: t.Object({ recipientPid: t.String() }, { additionalProperties: false }),
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

export type EditRecipientT = typeof EditRecipientS.body.static

export const pEditRecipient = {
	schema: EditRecipientS,
	handler: async (req: FastReqT<typeof EditRecipientS>, res: FastifyReply) => {
		await q_p_edit_recipient(req.body, req.params.recipientPid)
		res.code(200).send('ok')
	},
}

const GetReportsS = {
	querystring: t.Object({ dateFrom: t.Optional(t.String()) }, { additionalProperties: false }),
}

export const pGetReports = {
	schema: GetReportsS,
	handler: async (req: FastReqT<typeof GetReportsS>, res: FastifyReply) => {
		res.code(200).send(
			await q_p_get_recipients_report_t({
				tPid: req.token.pid,
				dateFrom: req.query.dateFrom,
			}),
		)
	},
}

import type { FastifyReply, FastifyRequest } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_pw_del_visit_log, q_w_create_visit_log } from '../../db/queries/visits_logs.query'
import {
	q_pw_check_if_worker_has_other_visit_in_progress,
	q_w_get_recipient_email_from_visit,
	q_w_get_visit,
	q_w_get_visit_status,
	q_w_get_visits_t,
} from '../../db/queries/visits.query'
import type { VisitStatusT } from '../../db/tables/visits.table'
import { WarnE } from '../../enums/warn.enum'
import { emailVisitApproval } from '../../providers/nodemailer/funcs/emailVisitApproval'
import type { FastReqT } from '../../types/fastify.type'
import { err } from '../../utils/err.util'
import { arrToObj } from '../../utils/obj.util'

export const wGetVisits = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		return res.code(200).send(await q_w_get_visits_t(req.token.pid))
	},
}

const GetVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
}

export const wGetVisit = {
	schema: GetVisitS,
	handler: async (req: FastReqT<typeof GetVisitS>, res: FastifyReply) => {
		return res.code(200).send(await q_w_get_visit(req.token.pid, req.params.visitPid))
	},
}

const ActionVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
	querystring: t.Object(
		{
			action: t.Enum(
				arrToObj([
					'STARTED',
					'SERVICE_COMPLETED',
					'SERVICE_UNCHECK',
					'PAUSED',
					'ENDED',
				] as VisitStatusT[]),
			),
			servicePid: t.Optional(t.String()),
		},
		{ additionalProperties: false },
	),
	body: t.Object(
		{
			sig: t.Optional(t.String()),
			pos: t.Optional(t.Object({ lat: t.Number(), lon: t.Number() })),
		},
		{ additionalProperties: false },
	),
}

const invalidAction: Record<VisitStatusT, VisitStatusT[]> = {
	NOT_STARTED: ['NOT_STARTED'],
	STARTED: ['STARTED'],
	SERVICE_COMPLETED: [],
	PAUSED: ['PAUSED'],
	ENDED: ['PAUSED', 'ENDED', 'AWAITING_APPROVAL'],
	AWAITING_APPROVAL: ['ENDED', 'AWAITING_APPROVAL'],
	APPROVED: ['APPROVED'],
	CANCELLED: ['STARTED', 'SERVICE_COMPLETED', 'PAUSED', 'ENDED', 'AWAITING_APPROVAL'],
}

export const wActionVisit = {
	schema: ActionVisitS,
	handler: async (req: FastReqT<typeof ActionVisitS>, res: FastifyReply) => {
		const tPid = req.token.pid
		const vPid = req.params.visitPid
		const action = req.query.action
		const body = req.body
		const sPid = req.query.servicePid
		const visit = await q_pw_check_if_worker_has_other_visit_in_progress(vPid, tPid)
		if (visit) {
			return res.code(200).send({ data: visit, message: WarnE.VISIT_IN_PROGRESS })
		}
		if ((action as 'SERVICE_UNCHECK') === 'SERVICE_UNCHECK' && sPid) {
			await q_pw_del_visit_log(vPid, tPid, sPid)
			return res.code(200).send(await q_w_get_visit(tPid, vPid))
		}
		const status = await q_w_get_visit_status(vPid)
		if (invalidAction[status].includes(action)) {
			throw err(400, `Action "${action}" is not allowed when status is "${status}"`)
		}
		await q_w_create_visit_log(vPid, action, tPid, sPid, body)
		if (action === 'ENDED' && !body.sig) {
			const { fullName, email } = await q_w_get_recipient_email_from_visit(vPid)
			emailVisitApproval({ email, name: fullName, vPid })
		}
		return res.code(200).send(await q_w_get_visit(tPid, vPid))
	},
}

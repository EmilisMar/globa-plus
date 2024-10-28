import type { FastifyReply } from 'fastify'
import { Type as t } from '@sinclair/typebox'

import {
	q_p_create_visit_log,
	q_p_create_visit_logs,
	q_pw_del_visit_log,
} from '../../db/queries/visits_logs.query'
import {
	q_p_cancel_visit,
	q_p_create_visit,
	q_p_create_visits,
	q_p_edit_visit,
	q_p_get_visit,
	q_p_get_visits_t,
} from '../../db/queries/visits.query'
import type { FastReqT } from '../../types/fastify.type'
import { arrToObj } from '../../utils/obj.util'

const GetVisitsS = {
	querystring: t.Object(
		{
			dateFrom: t.Optional(t.String()),
			dateEnd: t.Optional(t.String()),
			status: t.Optional(
				t.Union([
					t.Literal('NOT_STARTED'),
					t.Literal('STARTED'),
					t.Literal('PAUSED'),
					t.Literal('CANCELLED'),
					t.Literal('ENDED'),
				]),
			),
			workerPid: t.Optional(t.String()),
			recipientPid: t.Optional(t.String()),
		},
		{ additionalProperties: false },
	),
}

export const pGetVisits = {
	schema: GetVisitsS,
	handler: async (req: FastReqT<typeof GetVisitsS>, res: FastifyReply) => {
		return res
			.code(200)
			.send(
				await q_p_get_visits_t(
					req.token.pid,
					req.query.status,
					req.query.dateFrom,
					req.query.dateEnd,
					req.query.workerPid,
					req.query.recipientPid,
				),
			)
	},
}

const GetVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
}

export const pGetVisit = {
	schema: GetVisitS,
	handler: async (req: FastReqT<typeof GetVisitS>, res: FastifyReply) => {
		return res.code(200).send(await q_p_get_visit(req.token.pid, req.params.visitPid))
	},
}

const CreateVisitS = {
	body: t.Object(
		{
			workerPid: t.String(),
			recipientPid: t.String(),
			timeFrom: t.String(),
			timeTo: t.String(),
			isWeeklyRecurring: t.Optional(t.Boolean()),
		},
		{ additionalProperties: false },
	),
}

export type PCreateVisitT = typeof CreateVisitS.body.static

export const pCreateVisit = {
	schema: CreateVisitS,
	handler: async (req: FastReqT<typeof CreateVisitS>, res: FastifyReply) => {
		if (!req.body.isWeeklyRecurring) {
			await q_p_create_visit(req.body, req.token.pid)
			return res.code(200).send('ok')
		}
		await q_p_create_visits(req.body, req.token.pid)
		res.code(200).send('ok')
	},
}

const ActionVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
	querystring: t.Object(
		{
			action: t.Enum(arrToObj(['PROVIDER_ADD_TIME', 'SERVICE_COMPLETED', 'SERVICE_UNCHECK'])),
			servicePid: t.Optional(t.String()),
		},
		{ additionalProperties: false },
	),
	body: t.Object(
		{ timeFrom: t.Optional(t.String()), timeTo: t.Optional(t.String()) },
		{ additionalProperties: false },
	),
}

export const pActionVisit = {
	schema: ActionVisitS,
	handler: async (req: FastReqT<typeof ActionVisitS>, res: FastifyReply) => {
		const tPid = req.token.pid
		const vPid = req.params.visitPid
		const action = req.query.action
		const sPid = req.query.servicePid
		const { timeFrom, timeTo } = req.body
		if (action === 'PROVIDER_ADD_TIME' && timeFrom && timeTo) {
			await q_p_create_visit_logs(vPid, tPid, { timeTo, timeFrom })
		}
		if (action === 'SERVICE_UNCHECK' && sPid) {
			await q_pw_del_visit_log(vPid, tPid, sPid)
			return res.code(200).send(await q_p_get_visit(tPid, vPid))
		}
		if (action === 'SERVICE_COMPLETED') {
			await q_p_create_visit_log(vPid, tPid, sPid)
		}
		return res.code(200).send(await q_p_get_visit(tPid, vPid))
	},
}

const EditVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
	body: t.Object({ timeFrom: t.String(), timeTo: t.String() }, { additionalProperties: false }),
}

export const pEditVisit = {
	schema: EditVisitS,
	handler: async (req: FastReqT<typeof EditVisitS>, res: FastifyReply) => {
		const tPid = req.token.pid
		const vPid = req.params.visitPid
		const body = req.body
		await q_p_edit_visit(vPid, body)
		res.code(200).send(await q_p_get_visit(tPid, vPid))
	},
}

const CancelVisitS = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
}

export const pCancelVisit = {
	schema: CancelVisitS,
	handler: async (req: FastReqT<typeof CancelVisitS>, res: FastifyReply) => {
		await q_p_cancel_visit(req.token.pid, req.params.visitPid)
		res.code(200).send(await q_p_get_visit(req.token.pid, req.params.visitPid))
	},
}

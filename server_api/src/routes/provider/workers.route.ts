import type { FastifyReply, FastifyRequest } from 'fastify'

import { genCode } from '@mariuzm/utils'
import { Type as t } from '@sinclair/typebox'

import {
	q_create_worker,
	q_get_worker_visits,
	q_get_workers_t,
} from '../../db/queries/users_workers.query'
import { q_get_user, q_get_worker_opt } from '../../db/queries/users.query'
import { Err } from '../../enums/err.enum'
import { emailLogin } from '../../providers/nodemailer/funcs/emailLogin.func'
import type { FastReqT } from '../../types/fastify.type'
import { err } from '../../utils/err.util'
import { signEmailLoginToken } from '../../utils/token.util'

export const pGetWorkers = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		return res.code(200).send(await q_get_workers_t(req.token.pid))
	},
}

export const pGetWorkerOptions = {
	handler: async (req: FastifyRequest, res: FastifyReply) => {
		return res.code(200).send(await q_get_worker_opt(req.token.pid))
	},
}

const PGetWorkersS = {
	params: t.Object({ workerPid: t.String() }, { additionalProperties: false }),
}

export const pGetWorker = {
	schema: PGetWorkersS,
	handler: async (req: FastReqT<typeof PGetWorkersS>, res: FastifyReply) => {
		return res.code(200).send(await q_get_worker_visits(req.params.workerPid))
	},
}

const PCreateWorkerS = {
	body: t.Object(
		{
			providerPid: t.String(),
			email: t.String(),
			firstName: t.String(),
			lastName: t.String(),
			phone: t.String(),
		},
		{ additionalProperties: false },
	),
}

export type PCreateWorkerT = typeof PCreateWorkerS.body.static

export const pCreateWorker = {
	schema: PCreateWorkerS,
	handler: async (req: FastReqT<typeof PCreateWorkerS>, res: FastifyReply) => {
		const email = req.body.email
		const user = await q_get_user({ email })
		if (user) throw err(400, Err.EMAIL_ALREADY_EXISTS)
		const emailCode = genCode()
		await q_create_worker(req.body, emailCode, req.token.pid)
		const token = await signEmailLoginToken({ email: email, code: emailCode })
		emailLogin({ email, name: email, token })
		res.code(200).send('ok')
	},
}

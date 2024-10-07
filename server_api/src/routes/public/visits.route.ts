import { Type as t } from '@sinclair/typebox'
import type { FastifyReply } from 'fastify'

import { q_pub_visit_approval } from '../../db/queries/visits_logs.query'
import type { FastReqT } from '../../types/fastify.type'

// ------------------------------------------------------------------

const PubVisitApproval = {
	params: t.Object({ visitPid: t.String() }, { additionalProperties: false }),
}

export const pubVisitApproval = {
	schema: PubVisitApproval,
	handler: async (req: FastReqT<typeof PubVisitApproval>, res: FastifyReply) => {
		await q_pub_visit_approval(req.params.visitPid)
		return res.code(200).send('ok')
	},
}

// ------------------------------------------------------------------

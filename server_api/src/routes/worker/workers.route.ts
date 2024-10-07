import type { FastifyReply } from 'fastify'

import { Type as t } from '@sinclair/typebox'

import { q_w_check_pos } from '../../db/queries/users_workers.query'
import type { FastReqT } from '../../types/fastify.type'

const WCheckPos = {
	params: t.Object({ workerPid: t.String() }, { additionalProperties: false }),
	querystring: t.Object({ lat: t.String(), lon: t.String() }, { additionalProperties: false }),
}

export const wCheckPos = {
	schema: WCheckPos,
	handler: async (req: FastReqT<typeof WCheckPos>, res: FastifyReply) => {
		res.code(200).send(await q_w_check_pos(req.params.workerPid, req.query.lat, req.query.lon))
	},
}

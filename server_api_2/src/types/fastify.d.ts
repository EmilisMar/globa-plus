import fastify from 'fastify'
import type { Server } from 'socket.io'

import type { AuthToken } from '../utils/token.util'

declare module 'fastify' {
	interface FastifyInstance {
		io: Server
	}
	export interface FastifyRequest {
		token: AuthToken
	}
}

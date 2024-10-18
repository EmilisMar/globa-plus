import 'dotenv/config'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import { TypeBoxValidatorCompiler, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { getTable } from './routes/admin/_main.route'
import { apCreateCategory } from './routes/admin/categories.route'
import { createProvider } from './routes/admin/providers.route'
import { createRecipient } from './routes/admin/recipients.route'
import { createService } from './routes/admin/services.route'
import { apGetOptions, getOptions } from './routes/options.route'
import { pGetCategories } from './routes/provider/categories.route'
import {
	pCreateRecipient,
	pEditRecipient,
	pGetRecipient,
	pGetRecipients,
	pGetReports,
} from './routes/provider/recipients.route'
import { pCreateServices, pGetService } from './routes/provider/services.route'
import {
	pActionVisit,
	pCancelVisit,
	pCreateVisit,
	pEditVisit,
	pGetVisit,
	pGetVisits,
} from './routes/provider/visits.route'
import {
	pCreateWorker,
	pGetWorker,
	pGetWorkerOptions,
	pGetWorkers,
} from './routes/provider/workers.route'
import { login, verifyTokenRoute } from './routes/public/auth.route'
import { pubVisitApproval } from './routes/public/visits.route'
import { wActionVisit, wGetVisit, wGetVisits } from './routes/worker/visits.route'
import { wCheckPos } from './routes/worker/workers.route'
import { err } from './utils/err.util'
import { verifyAuthToken } from './utils/token.util'

const PORT = Number(process.env.PORT) || 3000

Fastify()
	.withTypeProvider<TypeBoxTypeProvider>()
	.setValidatorCompiler(TypeBoxValidatorCompiler)
	.register(cors, { origin: '*' })
	.addHook('onRoute', (req) => {
		if (req.path === '/auth/user') req.bodyLimit = 100000000
	})
	.setErrorHandler((err, req, res) => {
		const errMsg: { message: string; status: number } = err.message as never
		const msg = errMsg.message
		const status = errMsg.status
		if (status && msg) res.status(status).send({ message: msg })
		res.status(500).send({ message: err.message })
	})
	.get('/', () => 'Hello from Marius.dev!')
	.post('/auth/login', login)
	.post('/visit/:visitPid/approve', pubVisitApproval)
	.register(async (app) => {
		app
			.addHook('onRequest', async (req, res) => {
				const token = await verifyAuthToken(req.headers.authorization)
				req.token = token
			})
			.get('/auth/token-verify', verifyTokenRoute)
			.get('/options/:tableName', getOptions)
	})
	.register(
		async (app) => {
			app
				.addHook('onRequest', async (req, res) => {
					const token = await verifyAuthToken(req.headers.authorization)
					if (token.role !== 'admin') throw err(401)
					req.token = token
				})
				.get('/:tableName', getTable)
				.get('/options/:entity', apGetOptions)
				.post('/categories', apCreateCategory)
				.post('/providers', createProvider)
				.post('/recipients', createRecipient)
				.post('/services', createService)
		},
		{ prefix: '/admin/entity' },
	)
	.register(
		async (app) => {
			app
				.addHook('onRequest', async (req, res) => {
					const token = await verifyAuthToken(req.headers.authorization)
					if (token.role !== 'provider') throw err(401)
					req.token = token
				})
				.get('/options/:entity', apGetOptions)
				.get('/categories', pGetCategories)
				.post('/categories', apCreateCategory)
				.get('/recipients', pGetRecipients)
				.get('/recipients/:recipientPid', pGetRecipient)
				.post('/recipients', pCreateRecipient)
				.patch('/recipients/:recipientPid', pEditRecipient)
				.get('/reports', pGetReports)
				.get('/services', pGetService)
				.post('/services', pCreateServices)
				.get('/visits', pGetVisits)
				.get('/visits/:visitPid', pGetVisit)
				.post('/visits', pCreateVisit)
				.post('/visits/:visitPid', pActionVisit)
				.patch('/visits/:visitPid', pEditVisit)
				.patch('/visits/:visitPid/cancel', pCancelVisit)
				.get('/workers', pGetWorkers)
				.get('/workers/options', pGetWorkerOptions)
				.get('/workers/:workerPid', pGetWorker)
				.post('/workers', pCreateWorker)
		},
		{ prefix: '/provider/entity' },
	)
	.register(
		async (app) => {
			app
				.addHook('onRequest', async (req, res) => {
					const token = await verifyAuthToken(req.headers.authorization)
					if (token.role !== 'worker') throw err(401)
					req.token = token
				})
				.get('/visits', wGetVisits)
				.get('/visits/:visitPid', wGetVisit)
				.post('/visits/:visitPid', wActionVisit)
				.get('/:workerPid/check-pos', wCheckPos)
		},
		{ prefix: '/worker/entity' },
	)
	.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		console.log(`Server running on port:${PORT}`)
	})

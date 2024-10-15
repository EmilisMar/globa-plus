import { sql } from 'kysely'
import { getDistance } from '@mariuzm/utils'

import { dbk } from '../../providers/kysely.provider'
import type { PCreateWorkerT } from '../../routes/provider/workers.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'

export const q_create_worker = async (
	body: PCreateWorkerT,
	emailCode: number,
	tokenPid: string,
) => {
	return await dbk.transaction().execute(async (t) => {
		const u = await t
			.insertInto('users')
			.values({ pid: genId(), email: body.email, role: 'worker' })
			.returning('pid')
			.executeTakeFirst()
		if (!u) throw err(500)
		const d = await t
			.insertInto('users_workers')
			.values({
				pid: u.pid,
				first_name: body.firstName,
				last_name: body.lastName,
				email_code: emailCode,
				phone: body.phone,
				created_by: tokenPid,
			})
			.returning('pid')
			.executeTakeFirst()
		if (!d) throw err(500)
	})
}

export const q_get_workers_t = async (tPid: string) => {
	return await dbk
		.selectFrom('users_workers as uw')
		.leftJoin('users as u', 'u.pid', 'uw.pid')
		.where('uw.created_by', '=', tPid)
		.select([
			'u.pid',
			'uw.first_name as firstName',
			'uw.last_name as lastName',
			'u.email',
			'uw.phone',
			'uw.created_at as createdAt',
		])
		.orderBy('uw.id', 'desc')
		.execute()
}

export const q_get_worker_visits = async (pid: string) => {
	return await dbk
		.selectFrom('visits as v')
		.leftJoin('recipients as r', 'r.pid', 'v.recipient_pid')
		.where('v.worker_pid', '=', pid)
		.orderBy('v.id', 'desc')
		.select((e) => [
			'v.pid as id',
			'v.worker_pid as workerPid',
			'v.time_from as start',
			'v.time_to as end',
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as(
				'recipientName',
			),
		])
		.execute()
}

export const q_update_worker_email_code = async (pid: string, code: number): Promise<void> => {
	const d = await dbk
		.updateTable('users_workers')
		.where('pid', '=', pid)
		.set({ email_code: code })
		.returning('pid')
		.executeTakeFirst()
	if (!d) throw err(500)
}

export const q_verify_worker_from_code = async (email: string, emailCode: number) => {
	return await dbk
		.updateTable('users_workers as uw')
		.where('uw.email_code', '=', emailCode)
		.from('users as u')
		.where('u.email', '=', email)
		.set({ email_code: null })
		.returning([
			'u.pid',
			'u.email',
			'u.role',
			'uw.first_name as firstName',
			'uw.last_name as lastName',
			'uw.created_at as createdAt',
		])
		.executeTakeFirst()
}

export const q_w_check_pos = async (workerPid: string, lat: string, lon: string) => {
	const q = await dbk
		.selectFrom('users_workers as uw')
		.where('uw.pid', '=', workerPid)
		.leftJoin('users as u', 'u.pid', 'uw.pid')
		.leftJoin('visits as v', 'v.worker_pid', 'uw.pid')
		.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
		.where('vl.action_status', '=', 'STARTED')
		.select((e) => [
			'uw.pid as workerPid',
			'v.pid as visitPid',
			e.ref('vl.worker_location', '->').key('lat').as('lat'),
			e.ref('vl.worker_location', '->').key('lon').as('lon'),
		])
		.execute()
	return getDistance(Number(lat), Number(lon), q)
}

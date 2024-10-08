import type { NotNull } from 'kysely'
import { expressionBuilder, sql } from 'kysely'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

import { generateEvents } from '@mariuzm/utils'

import { dbk } from '../../providers/kysely.provider'
import type { PCreateVisitT } from '../../routes/provider/visits.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'
import type { DB } from '../main.tables'
import type { VisitStatusT } from '../tables/visits.table'

export const q_p_get_visits_t = async (tPid: string) => {
	return await dbk
		.selectFrom('visits as v')
		.leftJoin('users_workers as uw', 'uw.pid', 'v.worker_pid')
		.leftJoin('recipients as r', 'r.pid', 'v.recipient_pid')
		.where('v.created_by', '=', tPid)
		.orderBy('v.id', 'desc')
		.select((e) => [
			'v.pid',
			sql<string>`concat(${e.ref('uw.first_name')}, ' ', ${e.ref('uw.last_name')})`.as('worker'),
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('recipient'),
			sql<string>`concat(
				${e.ref('r.address', '->>').key('adddress_line')}, ', ',
				${e.ref('r.address', '->>').key('town')}, ', ',
				${e.ref('r.address', '->>').key('postCode')})
			`.as('address'),
			'r.phone',
			'v.time_from as timeFrom',
			'v.time_to as timeTo',
			'v.status',
		])
		.execute()
}

export const q_w_get_visits_t = async (tPid: string, dateFrom?: string, dateEnd?: string) => {
	let query = dbk
		.selectFrom('visits as v')
		.leftJoin('recipients as r', 'r.pid', 'v.recipient_pid')
		.where('v.worker_pid', '=', tPid)
		.where((e) => 
			e.or([e('v.status', '!=', 'APPROVED'), e('v.status', '!=', 'CANCELLED')])
		);

	if (dateFrom) {
		query = query.where('v.time_from', '>=', new Date(dateFrom));
	}

	if (dateEnd) {
		query = query.where('v.time_to', '<', new Date(dateEnd));
	}

	return await query
		.orderBy('v.time_from', 'asc')
		.select((e) => [
			'v.pid',
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('recipient'),
			sql<string>`concat(
				${e.ref('r.address', '->>').key('adddress_line')}, ', ',
				${e.ref('r.address', '->>').key('town')}, ', ',
				${e.ref('r.address', '->>').key('postCode')})
			`.as('address'),
			'r.phone',
			'v.time_from as timeFrom',
			'v.time_to as timeTo',
			'v.status',
		])
		.execute();
};

export const q_p_get_visit = async (tPid: string, vPid: string) => {
	const q = await dbk
		.selectFrom('visits as v')
		.where('v.pid', '=', vPid)
		.select([
			'v.pid',
			'v.time_from as timeFrom',
			'v.time_to as timeTo',
			'v.status',
			getRecipient(),
			getVisitLogs(),
		])
		.orderBy('v.id', 'desc')
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_w_get_visit = async (tPid: string, vPid: string) => {
	const q = await dbk
		.selectFrom('visits as v')
		.where('v.pid', '=', vPid)
		.where('v.worker_pid', '=', tPid)
		.orderBy('v.id', 'desc')
		.select([
			'v.pid',
			'v.time_from as timeFrom',
			'v.time_to as timeTo',
			'v.status',
			getRecipient(),
			getVisitLogs(),
		])
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_pw_check_if_worker_has_other_visit_in_progress = async (
	vPid: string,
	wPid: string,
) => {
	const q = await dbk
		.selectFrom('visits as v')
		.where('v.pid', '!=', vPid)
		.where('v.worker_pid', '=', wPid)
		.where((e) =>
			e.or([
				e('v.status', '=', 'STARTED'),
				e('v.status', '=', 'PAUSED'),
				e('v.status', '=', 'SERVICE_COMPLETED'),
			]),
		)
		.select('v.pid')
		.executeTakeFirst()
	if (!q) return null
	return q.pid
}

export const q_w_get_recipient_email_from_visit = async (vPid: string) => {
	const q = await dbk
		.selectFrom('visits as v')
		.leftJoin('recipients as r', 'r.pid', 'v.recipient_pid')
		.where('v.pid', '=', vPid)
		.where('r.email', 'is not', null)
		.select((e) => [
			'r.email',
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('fullName'),
		])
		.$narrowType<{ email: NotNull }>()
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_w_get_visit_status = async (vPid: string): Promise<VisitStatusT> => {
	const q = await dbk
		.selectFrom('visits')
		.where('pid', '=', vPid)
		.select('status')
		.executeTakeFirst()
	if (!q) throw err(404)
	return q.status
}

export const q_p_create_visit = async (body: PCreateVisitT, tPid: string) => {
	const q = await dbk
		.insertInto('visits')
		.values({
			pid: genId(),
			worker_pid: body.workerPid,
			recipient_pid: body.recipientPid,
			status: 'NOT_STARTED',
			time_from: new Date(body.timeFrom),
			time_to: new Date(body.timeTo),
			created_by: tPid,
		})
		.returningAll()
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_p_create_visits = async (body: PCreateVisitT, tPid: string) => {
	const q = await dbk
		.insertInto('visits')
		.values(
			generateEvents<{
				worker_pid: string
				recipient_pid: string
				status: VisitStatusT
				created_by: string
			}>(
				new Date(body.timeFrom),
				new Date(body.timeTo),
				'week',
				5,
				{
					worker_pid: body.workerPid,
					recipient_pid: body.recipientPid,
					status: 'NOT_STARTED',
					created_by: tPid,
				},
				() => genId(),
			),
		)
		.returningAll()
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_p_edit_visit = async (vPid: string, body: { timeFrom: string; timeTo: string }) => {
	const q = await dbk
		.updateTable('visits')
		.where('pid', '=', vPid)
		.set({ time_from: new Date(body.timeFrom), time_to: new Date(body.timeTo) })
		.returning('pid')
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_p_cancel_visit = async (tPid: string, vPid: string) => {
	return await dbk.transaction().execute(async (t) => {
		const q = await t
			.updateTable('visits')
			.where('pid', '=', vPid)
			.set({ status: 'CANCELLED' })
			.returning('pid')
			.execute()
		if (!q) throw err(404)
		await t
			.insertInto('visits_logs')
			.values([{ pid: genId(), visit_pid: vPid, action_status: 'CANCELLED', created_by: tPid }])
			.execute()
		return q
	})
}

const getCategories = () => {
	const e = expressionBuilder<DB & { v: DB['visits'] }, 'v'>()
	return jsonArrayFrom(
		e
			.selectFrom('categories as c')
			.leftJoin('users as u', 'u.pid', 'c.created_by')
			.where((e) => e.or([e('u.pid', '=', e.ref('v.created_by')), e('u.role', '=', 'admin')]))
			.select((e) => [
				'c.pid',
				'c.name',
				jsonArrayFrom(
					e
						.selectFrom('services as s')
						.whereRef('s.category_pid', '=', 'c.pid')
						.leftJoin('visits_logs as vl', (j) =>
							j.onRef('vl.service_pid', '=', 's.pid').onRef('vl.visit_pid', '=', 'v.pid'),
						)
						.select(['s.pid', 's.name', 'vl.action_status as actionStatus']),
				).as('services'),
			]),
	).as('categories')
}

const getRecipient = () => {
	const e = expressionBuilder<DB & { v: DB['visits'] }, 'v'>()
	return jsonObjectFrom(
		e
			.selectFrom('recipients as r')
			.whereRef('r.pid', '=', 'v.recipient_pid')
			.select((e) => [
				'r.pid',
				sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('fullName'),
				sql<string>`concat(
					${e.ref('r.address', '->>').key('adddress_line')}, ', ',
					${e.ref('r.address', '->>').key('town')}, ', ',
					${e.ref('r.address', '->>').key('postCode')})
				`.as('address'),
				'r.phone',
				'r.notes',
				'r.created_by as createdBy',
				'r.approve_by',
				getCategories(),
			]),
	).as('recipient')
}

const getVisitLogs = () => {
	const e = expressionBuilder<DB & { v: DB['visits'] }, 'v'>()
	return jsonArrayFrom(
		e
			.selectFrom('visits_logs as vl')
			.whereRef('vl.visit_pid', '=', 'v.pid')
			.leftJoin('users as u', 'u.pid', 'vl.created_by')
			.leftJoin('services as s', 'vl.service_pid', 's.pid')
			.orderBy('vl.id', 'asc')
			.select((e) => [
				'vl.action_status as actionStatus',
				's.name as serviceName',
				'vl.time_log',
				e.ref('vl.worker_location', '->').key('lat').as('lat'),
				e.ref('vl.worker_location', '->').key('lon').as('lon'),
				'u.role as createdByRole',
				'vl.created_at as createdAt',
			]),
	).as('visit_logs')
}

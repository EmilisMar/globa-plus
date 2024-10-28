import { sql, type Expression, type SqlBool } from 'kysely'
import { getEndOfMonth } from '@mariuzm/utils'

import { dbk } from '../../providers/kysely.provider'
import type { CreateRecipientT } from '../../routes/admin/recipients.route'
import type { EditRecipientT } from '../../routes/provider/recipients.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'

export const q_a_get_recipients_t = async (pPid?: string) => {
	let q = dbk
		.selectFrom('recipients')
		.select(['pid', 'first_name as firstName', 'last_name as lastName', 'created_at as createdAt'])
		.orderBy('id', 'desc')
	if (pPid) q = q.where('created_by', '=', pPid)
	return await q.execute()
}

export const q_a_get_recipients_with_admins_t = async (tPid: string) => {
	return await dbk
		.selectFrom('recipients as r')
		.leftJoin('users as u', 'u.pid', 'r.created_by')
		.where((e) => e.or([e('r.created_by', '=', tPid), e('u.role', '=', 'admin')]))
		.select((e) => [
			'r.pid',
			'r.first_name as firstName',
			'r.last_name as lastName',
			sql<string>`concat(
				${e.ref('r.address', '->>').key('adddress_line')}, ', ',
				${e.ref('r.address', '->>').key('town')}, ', ',
				${e.ref('r.address', '->>').key('postCode')})
			`.as('address'),
			'r.phone',
			'u.email as createdByEmail',
			'u.role as createdByRole',
		])
		.orderBy('r.created_at', 'desc')
		.execute()
}

export const q_p_get_recipients_options_t = async (tPid: string) => {
	return await dbk
		.selectFrom('recipients')
		.where('created_by', '=', tPid)
		.select((e) => [
			'pid as value',
			sql<string>`concat(${e.ref('first_name')}, ' ', ${e.ref('last_name')})`.as('label'),
		])
		.execute()
}

export const q_p_get_recipient = async (pid: string) => {
	const q = await dbk
		.selectFrom('recipients')
		.where('pid', '=', pid)
		.select([
			'pid',
			'first_name as firstName',
			'last_name as lastName',
			'hourly_rate as hourlyRate',
			'address',
			'phone',
			'notes',
			'service_groups as serviceGroups',
			'approve_by as approveBy',
			'email',
			'created_by as createBy',
		])
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_ap_create_recipient = async (body: CreateRecipientT, tPid: string) => {
	const q = await dbk
		.insertInto('recipients')
		.values({
			pid: genId(),
			first_name: body.firstName,
			last_name: body.lastName,
			address: body.address,
			phone: body.phone,
			notes: body.notes,
			hourly_rate: body.hourlyRate,
			service_groups: body.serviceGroups,
			approve_by: body.approveBy,
			email: body.email,
			created_by: tPid,
		})
		.returningAll()
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_p_edit_recipient = async (body: EditRecipientT, pid: string) => {
	const q = await dbk
		.updateTable('recipients')
		.set({
			first_name: body.firstName,
			last_name: body.lastName,
			address: body.address,
			phone: body.phone,
			notes: body.notes,
			hourly_rate: body.hourlyRate,
			service_groups: body.serviceGroups,
			approve_by: body.approveBy,
			email: body.email,
		})
		.where('pid', '=', pid)
		.returning([
			'pid',
			'first_name as firstName',
			'last_name as lastName',
			'hourly_rate as hourlyRate',
			'address',
			'phone',
			'notes',
			'approve_by as approveBy',
			'email',
		])
		.executeTakeFirst()
	if (!q) throw err(404)
	return q
}

export const q_get_recipients_opt = async (tPid: string) => {
	return await dbk
		.selectFrom('recipients as r')
		.leftJoin('users as u', 'u.pid', 'r.created_by')
		.where((e) => e.or([e(e.ref('r.created_by'), '=', tPid), e('u.role', '=', 'admin')]))
		.select((e) => [
			'r.pid as value',
			'r.created_by as createdBy',
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('label'),
		])
		.execute()
}

export const q_a_get_recipients_report_t = async ({ dateFrom }: { dateFrom?: string }) => {
	const dateTo = getEndOfMonth(dateFrom)
	const a: Expression<SqlBool>[] = []
	const q = await dbk
		.selectFrom('recipients as r')
		.select((e) => [
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('recipient'),
			e
				.selectFrom('visits as v')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.where('vl.action_status', '=', 'ENDED')
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.cast<number>(e.fn.countAll(), 'integer').as('visitsCount'))
				.as('visitsCount'),
			e
				.selectFrom('visits as v')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.leftJoin('services as s', 's.pid', 'vl.service_pid')
				.where('vl.service_pid', 'is not', null)
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.cast<number>(e.fn.countAll(), 'integer').as('servicesCompleted'))
				.as('servicesCompleted'),
			e
				.selectFrom('visits as v')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.leftJoin('services as s', 's.pid', 'vl.service_pid')
				.where('vl.service_pid', 'is not', null)
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.fn.agg<string[]>('array_agg', ['s.time']).as('servicesCompletedHours'))
				.as('servicesCompletedHours'),
		])
		.execute()
	if (!q) throw err(404)
	return q
}

export const q_p_get_recipients_report_t = async ({
	tPid,
	dateFrom,
	dateEnd: dateTo,
}: {
	tPid: string
	dateFrom?: string
	dateEnd?: string
}) => {
	const a: Expression<SqlBool>[] = []
	const q = await dbk
		.selectFrom('recipients as r')
		.leftJoin('users as u', 'u.pid', 'r.created_by')
		.where((e) => e.or([e('r.created_by', '=', tPid), e('u.role', '=', 'admin')]))
		.select((e) => [
			sql<string>`concat(${e.ref('r.first_name')}, ' ', ${e.ref('r.last_name')})`.as('recipient'),
			e
				.selectFrom('visits as v')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.where('vl.action_status', '=', 'ENDED')
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.cast<number>(e.fn.countAll(), 'integer').as('visitsCount'))
				.as('visitsCount'),
			e
				.selectFrom('visits as v')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.leftJoin('services as s', 's.pid', 'vl.service_pid')
				.where('vl.service_pid', 'is not', null)
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.cast<number>(e.fn.countAll(), 'integer').as('servicesCompleted'))
				.as('servicesCompleted'),
			e
				.selectFrom('visits as v')
				.whereRef('v.recipient_pid', '=', 'r.pid')
				.leftJoin('visits_logs as vl', 'vl.visit_pid', 'v.pid')
				.leftJoin('services as s', 's.pid', 'vl.service_pid')
				.where('vl.service_pid', 'is not', null)
				.where((e) => {
					if (!dateFrom || !dateTo) return e.and(a)
					return e('vl.created_at', '>=', dateFrom).and('vl.created_at', '<=', dateTo)
				})
				.select((e) => e.fn.agg<string[]>('array_agg', ['s.time']).as('servicesCompletedHours'))
				.as('servicesCompletedHours'),
		])
		.execute()
	if (!q) throw err(404)
	return q
}

import { dbk } from '../../providers/kysely.provider'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'
import type { VisitStatusT } from '../tables/visits.table'

type Time = {
	timeFrom: string
	timeTo: string
}

export const q_p_create_visit_logs = async (vPid: string, tPid: string, body: Time) => {
	return await dbk.transaction().execute(async (t) => {
		await t.updateTable('visits').where('pid', '=', vPid).set({ status: 'ENDED' }).execute()
		await t
			.insertInto('visits_logs')
			.values([
				{
					pid: genId(),
					visit_pid: vPid,
					action_status: 'STARTED',
					time_log: body.timeFrom,
					created_by: tPid,
				},
				{
					pid: genId(),
					visit_pid: vPid,
					action_status: 'ENDED',
					time_log: body.timeTo,
					created_by: tPid,
				},
			])
			.execute()
	})
}

export const q_pw_del_visit_log = async (vPid: string, tPid: string, sPid: string) => {
	return await dbk.transaction().execute(async (t) => {
		const vl = await t
			.deleteFrom('visits_logs')
			.where('visit_pid', '=', vPid)
			.where('service_pid', '=', sPid)
			.where('created_by', '=', tPid)
			.where('action_status', '=', 'SERVICE_COMPLETED')
			.executeTakeFirst()
		if (!vl) throw err(400, 'Edit this service is not allowed')
		const q = await t
			.selectFrom('visits_logs')
			.where('visit_pid', '=', vPid)
			.select('action_status as actionStatus')
			.orderBy('created_at', 'desc')
			.executeTakeFirst()
		if (q) {
			await t
				.updateTable('visits')
				.where('pid', '=', vPid)
				.set({ status: q.actionStatus })
				.execute()
		} else {
			await t.updateTable('visits').where('pid', '=', vPid).set({ status: 'NOT_STARTED' }).execute()
		}
	})
}

export const q_p_create_visit_log = async (vPid: string, tPid: string, sPid?: string) => {
	return await dbk.transaction().execute(async (t) => {
		await t
			.updateTable('visits')
			.where('pid', '=', vPid)
			.set({ status: 'SERVICE_COMPLETED' })
			.execute()
		await t
			.insertInto('visits_logs')
			.values({
				pid: genId(),
				visit_pid: vPid,
				service_pid: sPid,
				action_status: 'SERVICE_COMPLETED',
				created_by: tPid,
			})
			.execute()
		return
	})
}

export const q_w_create_visit_log = async (
	vPid: string,
	action: VisitStatusT,
	tPid: string,
	sPid?: string,
	body?: {
		sig?: string
		pos?: { lat: number; lon: number }
	},
) => {
	return await dbk.transaction().execute(async (t) => {
		if (action === 'ENDED' && body && body.sig) {
			await t.updateTable('visits').where('pid', '=', vPid).set({ status: 'APPROVED' }).execute()
			await t
				.insertInto('visits_approvals')
				.values({ pid: genId(), visit_pid: vPid, signature: body.sig, created_by: tPid })
				.execute()
			await t
				.insertInto('visits_logs')
				.values([
					{ pid: genId(), visit_pid: vPid, action_status: 'ENDED', created_by: tPid },
					{ pid: genId(), visit_pid: vPid, action_status: 'APPROVED', created_by: tPid },
				])
				.execute()
			return
		}
		if (action === 'ENDED' && body && !body.sig) {
			await t
				.updateTable('visits')
				.where('pid', '=', vPid)
				.set({ status: 'AWAITING_APPROVAL' })
				.execute()
			await t
				.insertInto('visits_logs')
				.values([
					{ pid: genId(), visit_pid: vPid, action_status: 'ENDED', created_by: tPid },
					{ pid: genId(), visit_pid: vPid, action_status: 'AWAITING_APPROVAL', created_by: tPid },
				])
				.execute()
			return
		}
		await t.updateTable('visits').where('pid', '=', vPid).set({ status: action }).execute()
		if (action === 'SERVICE_COMPLETED' && sPid) {
			await t
				.insertInto('visits_logs')
				.values({
					pid: genId(),
					visit_pid: vPid,
					service_pid: sPid,
					action_status: 'SERVICE_COMPLETED',
					created_by: tPid,
				})
				.execute()
			return
		}
		await t
			.insertInto('visits_logs')
			.values({
				pid: genId(),
				visit_pid: vPid,
				action_status: action,
				...(action === 'STARTED' && body && { worker_location: body.pos }),
				created_by: tPid,
			})
			.execute()
		return
	})
}

export const q_pub_visit_approval = async (vPid: string) => {
	await dbk.transaction().execute(async (t) => {
		const admin = await t
			.selectFrom('users')
			.where('email', '=', 'admin_visit_approver@care.app')
			.select('pid')
			.executeTakeFirst()
		if (!admin) throw err(500)
		await t.updateTable('visits').where('pid', '=', vPid).set({ status: 'APPROVED' }).execute()
		await t
			.insertInto('visits_logs')
			.values({ pid: genId(), visit_pid: vPid, action_status: 'APPROVED', created_by: admin.pid })
			.executeTakeFirst()
	})
}

import { jsonObjectFrom } from 'kysely/helpers/postgres'

import { dbk } from '../../providers/kysely.provider'
import { err } from '../../utils/err.util'
import type { UserRoleT } from '../tables/users.table'

export const q_get_users = async () => {
	return await dbk.selectFrom('users').select(['pid', 'email', 'role']).execute()
}

export const q_get_user = async ({ pid, email }: { pid?: string; email?: string }) => {
	let q = dbk.selectFrom('users').select(['pid', 'email', 'role'])
	if (pid) q = q.where('pid', '=', pid)
	if (email) q = q.where('email', '=', email)
	return await q.executeTakeFirst()
}

export const q_get_user_detail = async ({ pid, role }: { pid: string; role: UserRoleT }) => {
	let q = dbk.selectFrom('users as u').where('pid', '=', pid).select(['pid', 'email', 'role'])

	if (role === 'admin') {
		q = q.select((e) => [
			jsonObjectFrom(
				e
					.selectFrom('users_admins as ua')
					.whereRef('ua.pid', '=', 'u.pid')
					.select(['ua.first_name as firstName', 'ua.last_name as lastName']),
			).as('user'),
		])
	}

	if (role === 'provider') {
		q = q.select((e) => [
			jsonObjectFrom(
				e
					.selectFrom('users_providers as up')
					.whereRef('up.pid', '=', 'u.pid')
					.select([
						'up.company_name as companyName',
						'up.company_code as companyCode',
						'up.created_by as createdBy',
						'up.created_at as createdAt',
					]),
			).as('user'),
		])
	}

	if (role === 'worker') {
		q = q.select((e) => [
			jsonObjectFrom(
				e
					.selectFrom('users_workers as uw')
					.whereRef('uw.pid', '=', 'u.pid')
					.select([
						'uw.first_name as firstName',
						'uw.last_name as lastName',
						'uw.phone',
						'uw.created_by as createdBy',
						'uw.created_at as createdAt',
					]),
			).as('user'),
		])
	}

	const d = await q.executeTakeFirst()
	if (!d) throw err(404)
	return d
}

export const q_get_users_opt = async (role: UserRoleT, tPid: string) => {
	let q = dbk.selectFrom('users as u').where('role', '=', role)
	if (role === 'provider') {
		q = q
			.innerJoin('users_providers as ur', 'ur.pid', 'u.pid')
			.where((e) => e.or([e(e.ref('ur.created_by'), '=', tPid), e('u.role', '=', 'admin')]))
	}
	if (role === 'worker') {
		q = q
			.innerJoin('users_workers as ur', 'ur.pid', 'u.pid')
			.where((e) => e.or([e(e.ref('ur.created_by'), '=', tPid), e('u.role', '=', 'admin')]))
	}
	return await q.select(['u.pid as value', 'u.email as label']).execute()
}

export const q_get_worker_opt = async (tPid: string) => {
	return await dbk
		.selectFrom('users as u')
		.where('u.role', '=', 'worker')
		.leftJoin('users_workers as uw', 'u.pid', 'uw.pid')
		.whereRef('uw.pid', '=', 'u.pid')
		.where('uw.created_by', '=', tPid)
		.select(['u.pid as value', 'u.email as label'])
		.execute()
}

export const q_update_user_email_code = async (
	pid: string,
	code: number,
	role: 'provider' | 'worker',
) => {
	return await dbk
		.updateTable(`users_${role}s as u2`)
		.leftJoin('users as u', 'u2.pid', 'u.pid')
		.where('u.pid', '=', pid)
		.where('u2.email_code', '=', code)
		.set({ email_code: code })
		.returning('u.pid')
		.executeTakeFirst()
}

import { Err } from '../../enums/err.enum'
import { dbk } from '../../providers/kysely.provider'
import { err } from '../../utils/err.util'

export const q_get_admin_from_email = async (email: string) => {
	const q = await dbk
		.selectFrom('users_admins as ua')
		.innerJoin('users as u', 'u.pid', 'ua.pid')
		.select([
			'u.pid',
			'u.email',
			'u.role',
			'ua.first_name as firstName',
			'ua.last_name as lastName',
			'ua.password',
			'ua.created_at as createdAt',
		])
		.where('u.email', '=', email)
		.executeTakeFirstOrThrow()
	if (!q) throw err(404, Err.USER_NOT_FOUND)
	return q
}

export const q_a_get_admin_from_pid = async (pid: string) => {
	const q = await dbk
		.selectFrom('users_admins')
		.select('pid')
		.where('pid', '=', pid)
		.executeTakeFirst()
	if (!q) throw err(404, Err.USER_NOT_FOUND)
}

export const q_p_get_admin = async (pid: string) => {
	let q = dbk
		.selectFrom('users_admins as ua')
		.leftJoin('users as u', 'ua.pid', 'u.pid')
		.select('u.pid')
	if (pid) q = q.where('u.pid', '=', pid)
	return await q.executeTakeFirst()
}

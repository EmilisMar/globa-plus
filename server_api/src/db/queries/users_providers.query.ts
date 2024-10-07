import { dbk } from '../../providers/kysely.provider'
import type { CreateProviderT } from '../../routes/admin/providers.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'

export const q_create_provider = async (
	body: CreateProviderT,
	emailCode: number,
	tokenPid: string,
) => {
	return await dbk.transaction().execute(async (t) => {
		const u = await t
			.insertInto('users')
			.values({ pid: genId(), email: body.email, role: 'provider' })
			.returning('pid')
			.executeTakeFirst()
		if (!u) throw err(500)
		const d = await t
			.insertInto('users_providers')
			.values({
				pid: u.pid,
				company_name: body.companyName,
				company_code: body.companyCode,
				email_code: emailCode,
				created_by: tokenPid,
			})
			.returning('pid')
			.executeTakeFirst()
		if (!d) throw err(500)
	})
}

export const q_get_providers_t = async () => {
	return await dbk
		.selectFrom('users_providers as up')
		.innerJoin('users as u', 'u.pid', 'up.pid')
		.select([
			'up.pid',
			'u.email',
			'up.company_name as companyName',
			'up.company_code as companyCode',
			'up.created_at as createdAt',
		])
		.orderBy('up.id', 'desc')
		.execute()
}

export const q_get_provider = async (pid: string) => {
	const d = await dbk
		.selectFrom('users_providers')
		.select([
			'pid',
			'company_name as companyName',
			'company_code as companyCode',
			'created_at as createdAt',
		])
		.where('pid', '=', pid)
		.executeTakeFirst()
	if (!d) throw err(404)
	return d
}

export const q_update_provider_email_code = async (pid: string, code: number) => {
	const d = await dbk
		.updateTable('users_providers')
		.where('pid', '=', pid)
		.set({ email_code: code })
		.returning('pid')
		.executeTakeFirst()
	if (!d) throw err(500)
}

export const q_verify_provider_from_code = async (email: string, emailCode: number) => {
	return await dbk
		.updateTable('users_providers as up')
		.where('up.email_code', '=', emailCode)
		.from('users as u')
		.where('u.email', '=', email)
		.set({ email_code: null })
		.returning([
			'u.pid',
			'u.email',
			'u.role',
			'up.company_name as companyName',
			'up.company_code as companyCode',
			'up.created_at as createdAt',
		])
		.executeTakeFirst()
}

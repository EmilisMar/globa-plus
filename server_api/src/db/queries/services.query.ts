import { convertHHMMToMinutes } from '@mariuzm/utils'

import { dbk } from '../../providers/kysely.provider'
import type { CreateServiceT } from '../../routes/admin/services.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'

export const q_ap_create_service = async (body: CreateServiceT, tokenPid: string) => {
	const q = await dbk
		.insertInto('services')
		.values({
			pid: genId(),
			category_pid: body.categoryPid,
			name: body.name,
			time: convertHHMMToMinutes(body.time),
			created_by: tokenPid,
		})
		.returningAll()
		.executeTakeFirst()
	if (!q) throw err(500)
	return q
}

export const q_ap_get_services_t = async (tokenPid: string) => {
	let q = dbk
		.selectFrom('services as s')
		.select((e) => [
			'pid',
			'name',
			e
				.selectFrom('categories as c')
				.whereRef('c.pid', '=', 's.category_pid')
				.select('name')
				.as('categoryName'),
			'time',
			'created_by as createdBy',
			'created_at as createdAt',
		])
		.orderBy('id', 'desc')
	if (tokenPid) q = q.where('created_by', '=', tokenPid)
	return await q.execute()
}

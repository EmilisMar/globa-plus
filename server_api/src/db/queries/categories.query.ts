import { dbk } from '../../providers/kysely.provider'
import type { CreateCategoryT } from '../../routes/admin/categories.route'
import { err } from '../../utils/err.util'
import { genId } from '../../utils/genId.util'

export const q_ap_create_category = async (body: CreateCategoryT, tokenPid: string) => {
	const q = await dbk
		.insertInto('categories')
		.values({
			pid: genId(),
			category_group_pid: body.categoryGroup,
			name: body.name,
			created_by: tokenPid,
		})
		.returning('pid')
		.executeTakeFirst()
	if (!q) throw err(500)
	return q
}

export const q_ap_get_categories_t = async (tokenPid: string) => {
	let q = dbk.selectFrom('categories').select(['pid', 'name', 'created_at']).orderBy('id', 'desc')
	if (tokenPid) q = q.where('created_by', '=', tokenPid)
	return await q.execute()
}

export const q_get_categories_opt = async (tokenPid: string) => {
	return await dbk
		.selectFrom('categories')
		.where('created_by', '=', tokenPid)
		.select(['pid as value', 'name as label'])
		.execute()
}

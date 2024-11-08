import { dbk } from '../../providers/kysely.provider'
import type { CreateCategoryT, EditCategoryT } from '../../routes/admin/categories.route'
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
	let q = dbk
		.selectFrom('categories')
		.select(['pid', 'name', 'created_at', 'category_group_pid'])
		.orderBy('id', 'desc')

	if (tokenPid) {
		q = q.where('created_by', '=', tokenPid)
	}

	return await q.execute()
}

export const q_ap_update_category = async (body: EditCategoryT, categoryPid: string, createdBy?: string) => {
	let query = dbk.updateTable('categories').set({
		category_group_pid: body.categoryGroup,
		name: body.name,
	})

	if (createdBy) {
		query = query.where('created_by', '=', createdBy)
	}

	const updatedCategory = await query
		.where('pid', '=', categoryPid)
		.returning(['pid', 'name', 'category_group_pid', 'created_at', 'created_by'])
		.executeTakeFirst()

	if (!updatedCategory) throw err(404, 'Category not found or access denied')
	return updatedCategory
}

export const q_get_category_by_id = async (categoryPid: string) => {
	const category = await dbk
	  .selectFrom('categories')
	  .select(['pid', 'name', 'category_group_pid', 'created_at', 'created_by'])
	  .where('pid', '=', categoryPid)
	  .executeTakeFirst()
	return category || null
  }

export const q_get_categories_opt = async (tokenPid: string) => {
	return await dbk
		.selectFrom('categories')
		.where('created_by', '=', tokenPid)
		.select(['pid as value', 'name as label'])
		.execute()
}

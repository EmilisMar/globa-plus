import { dbk } from '../../providers/kysely.provider'

export const q_p_get_categories_groups_opt = async (tPid: string) => {
	return await dbk
		.selectFrom('categories_groups')
		.select(['pid as value', 'name as label'])
		.execute()
}

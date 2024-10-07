import { req } from '../providers/axios.provider'

import type { TableOptionsT } from './types/options.api.type'

export const API_GET_Options = async (tableName: TableOptionsT) => {
	return await req.get<{ value: string; label: string }[]>(`/options/${tableName}`)
}

export const API_GET_OptionsV2 = async (tableName: 'categories_groups') => {
	return await req.get<{ value: string; label: string }[]>(`/provider/entity/options/${tableName}`)
}

export const API_GET_Entity_Options = async (tableName: 'workers') => {
	return await req.get<{ value: string; label: string }[]>(`/provider/entity/${tableName}/options`)
}

import { toastErr } from '../components/Toast'
import { UsersE } from '../enums/users.enum'
import { req } from '../providers/axios.provider'
import { useStateUser } from '../states/user.state'

import type { TableOptionsT } from './types/options.api.type'

export const API_GET_Options = async (tableName: TableOptionsT) => {
	return await req.get<{ value: string; label: string }[]>(`/options/${tableName}`)
}

export const API_GET_OptionsV2 = async (tableName: 'categories_groups') => {
	const role = useStateUser.getState().user?.role
	if (!role) toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.get<{ value: string; label: string }[]>(`/${role}/entity/options/${tableName}`)
}

export const API_GET_Entity_Options = async (tableName: 'workers') => {
	return await req.get<{ value: string; label: string }[]>(`/provider/entity/${tableName}/options`)
}

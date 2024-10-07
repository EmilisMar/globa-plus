import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateUser } from '../../states/user.state'
import type { TableNamesT } from '../types/entities.api.type'

export const API_GET_Table = async (table: TableNamesT, dateFrom?: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	const query = dateFrom ? `?dateFrom=${dateFrom}` : ''
	return await req.get(`/${role}/entity/${table}${query}`)
}

export const API_GET_Detail = async (table: TableNamesT, pid: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.get(`/${role}/entity/${table}/${pid}`)
}

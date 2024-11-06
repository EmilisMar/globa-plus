import type { AddCategoryT } from '../../components/BuilderForm/schemas/main.schema'
import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateUser } from '../../states/user.state'

export const API_POST_Category = async (data: AddCategoryT) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.post(`/${role}/entity/categories`, data)
}

export const API_PATCH_Category = async (data: AddCategoryT, catPid: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
		console.log('priejom?')
	return await req.patch(`/${role}/entity/categories/${catPid}`, data)
}
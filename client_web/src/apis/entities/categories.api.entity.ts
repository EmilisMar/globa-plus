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

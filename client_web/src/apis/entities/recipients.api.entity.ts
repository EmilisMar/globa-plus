import type { AddRecipientT } from '../../components/BuilderForm/schemas/main.schema'
import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateUser } from '../../states/user.state'

export const API_POST_Recipient = async (data: AddRecipientT) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.post(`/${role}/entity/recipients`, data)
}

export const API_PATCH_Recipient = async (data: AddRecipientT, recipientPid: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.patch(`/${role}/entity/recipients/${recipientPid}`, data)
}

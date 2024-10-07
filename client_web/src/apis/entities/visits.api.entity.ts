import type { AddEditTimeT, AddVisitT } from '../../components/BuilderForm/schemas/main.schema'
import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateData } from '../../states/data.state'
import { useStateUser } from '../../states/user.state'
import { WarnE } from '../enums/warn.api.enum'
import type { WorkerVisitT } from '../types/entities.api.type'
import type { WarnT } from '../types/warn.api.type'

export const API_GET_Visit = async (visitPid: string) => {
	const role = useStateUser.getState().user?.role
	if (!role) return null
	return await req.get<WorkerVisitT>(`/${role}/entity/visits/${visitPid}`)
}

export const API_POST_Visit = async (data: AddVisitT) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.post(`/${role}/entity/visits`, data)
}

export const API_POST_VisitAction = async ({
	vPid,
	status,
	sPid,
	body,
	openVisitModal,
	setVPid,
}: {
	vPid: string
	status: WorkerVisitT['status']
	sPid?: string
	body: AddEditTimeT | { sig: string } | Record<string, never>
	openVisitModal?: () => void
	setVPid?: (vPid: string) => void
}) => {
	const role = useStateUser.getState().user?.role
	if (!role) {
		toastErr(UsersE.USER_ROLE_NOT_FOUND)
		return false
	}
	const ifService = sPid ? `&servicePid=${sPid}` : ''
	const r = await req.post<WorkerVisitT | WarnT<string>>(
		`/${role}/entity/visits/${vPid}?action=${status}${ifService}`,
		body,
	)
	if ('message' in r) {
		if (r.message === WarnE.VISIT_IN_PROGRESS && r.data) {
			openVisitModal && openVisitModal()
			setVPid && setVPid(r.data)
		}
		return
	}
	r && useStateData.getState().setVisit(r)
}

export const API_PATCH_ProviderVisit = async (
	visitPid: string,
	data: { timeFrom: string; timeTo: string },
) => {
	return await req.patch(`/provider/entity/visits/${visitPid}`, data)
}

export const API_PATCH_CancelVisit = async (visitPid: string) => {
	return await req.patch<WorkerVisitT>(`/provider/entity/visits/${visitPid}/cancel`)
}

export const API_POST_VisitApproval = async (visitPid: string) => {
	return await req.post(`/visit/${visitPid}/approve`)
}

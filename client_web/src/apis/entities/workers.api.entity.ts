import type { AddWorkerT } from '../../components/BuilderForm/schemas/main.schema'
import { toastErr } from '../../components/Toast'
import { UsersE } from '../../enums/users.enum'
import { req } from '../../providers/axios.provider'
import { useStateUser } from '../../states/user.state'
import { t } from '../../utils/i18n.util'
import type { GetWorkerVisitT, WorkerPosT } from '../types/entities.api.type'

export const API_POST_Worker = async (data: AddWorkerT) => {
	const role = useStateUser.getState().user?.role
	if (!role) return toastErr(UsersE.USER_ROLE_NOT_FOUND)
	return await req.post(`/${role}/entity/workers`, data)
}

export const API_GET_WorkerVisits = async (workerPid?: string) => {
	if (!useStateUser.getState().user?.role) return false
	if (!workerPid) return false
	return await req.get<GetWorkerVisitT[]>(`/provider/entity/workers/${workerPid}`)
}

export const API_GET_CheckWorkerPos = async (workerPid: string, lat: number, lon: number) => {
	const r = await req.get<WorkerPosT[]>(`/worker/entity/${workerPid}/check-pos`, {
		params: { lat, lon },
	})
	if (r.length) {
		const dist = r[0].dist
		if (dist > 200) toastErr(t('loc_to_far'))
	}
	return r
}

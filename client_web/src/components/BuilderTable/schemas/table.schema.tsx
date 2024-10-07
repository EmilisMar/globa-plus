import { addMinutes, convertMinutesToHHMM, formatDate } from '@mariuzm/utils'

import type { WorkerVisitT } from '../../../apis/types/entities.api.type'
import { t } from '../../../utils/i18n.util'

export const COL_NAMES_OBJ: {
	[K: string]: { formater?: (value: any) => any }
} = {
	actionStatus: { formater: (v: WorkerVisitT['status']) => t(`s.${v}` as 's') },
	approveBy: { formater: (v: string) => t(`o.${v}` as 'o') },
	createdAt: { formater: formatDate },
	servicesCompletedHours: { formater: addMinutes },
	status: { formater: (v: WorkerVisitT['status']) => t(`s.${v}` as 's') },
	time: { formater: convertMinutesToHHMM },
	timeFrom: { formater: formatDate },
	timeLog: { formater: formatDate },
	timeTo: { formater: formatDate },
}

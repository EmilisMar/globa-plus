import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import type { DateSelectArg } from '@fullcalendar/core/index.js'

import { API_GET_WorkerVisits } from '../../apis/entities/workers.api.entity'
import type { GetWorkerVisitT } from '../../apis/types/entities.api.type'
import { AgendaCalendar } from '../../components/AgendaCalendar/AgendaCalendar'
import { ModalContainer } from '../../components/Modals/_ModalContainer'
import { useT } from '../../utils/i18n.util'

import { FormVisit } from './visits'

export const ProviderWorkerPage = () => {
	const wVisits = useLoaderData() as GetWorkerVisitT[]
	const wPid = useParams().workerPid
	const [visits, setVisits] = useState<GetWorkerVisitT[]>()
	const [onNewVisit, setOnNewVisit] = useState<DateSelectArg | null>(null)
	const t = useT()

	useEffect(() => {
		wVisits && setVisits(wVisits)
	}, [wVisits])

	if (!visits) return null
	if (!wPid) return null

	return (
		<div>
			<AgendaCalendar pid={wPid} events={visits} setOnNewVisit={setOnNewVisit} />
			<ModalContainer
				opened={!!onNewVisit}
				onClose={() => setOnNewVisit(null)}
				title={t('createVisit')}
			>
				<FormVisit
					{...(onNewVisit && {
						visit: { workerPid: wPid, start: onNewVisit.start, end: onNewVisit.end },
					})}
					cb={async () => {
						const r = await API_GET_WorkerVisits(wPid)
						if (r) setVisits(r)
					}}
				/>
			</ModalContainer>
		</div>
	)
}

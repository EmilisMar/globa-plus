import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import type { DateSelectArg } from '@fullcalendar/core/index.js'

import { API_GET_WorkerVisits } from '../../apis/entities/workers.api.entity'
import type { GetWorkerVisitT } from '../../apis/types/entities.api.type'
import { AgendaCalendar } from '../../components/AgendaCalendar/AgendaCalendar'
import { ModalContainer } from '../../components/Modals/_ModalContainer'
import { useT } from '../../utils/i18n.util'

import { useForm } from '@mariuzm/form'
import { toastSuccess } from '@/components/Toast'
import { DateTimePicker } from '@/components/BuilderForm/components/DateTimePicker'
import { SelectAPI } from '@/components/BuilderForm/components/Select/Select'
import { AddVisitS } from '@/components/BuilderForm/schemas/main.schema'
import { API_POST_Visit } from '@/apis/entities/visits.api.entity'
import { Checkbox } from '@/components/BuilderForm/components/Checkbox'
import { Button } from '@/components/Button'

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

const FormVisit = ({
	visit,
	cb,
}: {
	visit?: { workerPid: string; start: Date; end: Date }
	cb?: () => void
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const f = useForm(AddVisitS)
	const t = useT()

	useEffect(() => {
		if (visit) {
			visit.workerPid && f.setValue('workerPid', visit.workerPid)
			visit.start && f.setValue('timeFrom', visit.start)
			visit.end && f.setValue('timeTo', visit.end)
		}
	}, [f, visit])

	return (
		<form
			onSubmit={f.handleSubmit(async (formData) => {
				setIsLoading(true)
				await API_POST_Visit(formData)
				cb && cb()
				setIsLoading(false)
				f.reset()
				toastSuccess('Visit created successfully')
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			{!cb && (
				<SelectAPI id="workerPid" form={f} placeholder={t('selectWorker')} option="workers" />
			)}
			<SelectAPI
				id="recipientPid"
				form={f}
				placeholder={t('selectRecipient')}
				option="recipients"
			/>
			<DateTimePicker id="timeFrom" form={f} placeholder={t('t.timeFrom')} />
			<DateTimePicker id="timeTo" form={f} placeholder={t('t.timeTo')} />
			<Checkbox id="isWeeklyRecurring" label={t('isWeeklyRecurring')} form={f} />
			<Button title={t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

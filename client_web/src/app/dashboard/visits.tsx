import { useForm } from '@mariuzm/form'
import { useEffect, useState } from 'react'

import { API_POST_Visit } from '../../apis/entities/visits.api.entity'
import { Checkbox } from '../../components/BuilderForm/components/Checkbox'
import { DateTimePicker } from '../../components/BuilderForm/components/DateTimePicker'
import { SelectAPI } from '../../components/BuilderForm/components/Select/Select'
import { AddVisitS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useStateUser } from '../../states/user.state'
import { useT } from '../../utils/i18n.util'

export const VisitsPage = () => {
	const isWorker = useStateUser((s) => s.user?.role === 'worker')
	const t = useT()
	return (
		<div>
			<Table
				tableName="visits"
				isTimeframeFilter={isWorker}
				modalTitle={t('createVisit')}
				{...(isWorker ? null : { Form: FormVisit })}
				isDetail
			/>
		</div>
	)
}

export const FormVisit = ({
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
			<SelectAPI
				id="workerPid"
				form={f}
				placeholder={visit?.workerPid || t('selectWorker')}
				option="workers"
				isDisabled={!!visit?.workerPid}
			/>
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

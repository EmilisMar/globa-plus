import { useForm } from '@mariuzm/form'
import { useEffect } from 'react'

import { API_PATCH_ProviderVisit } from '../../apis/entities/visits.api.entity'
import { useStateData } from '../../states/data.state'
import { useT } from '../../utils/i18n.util'
import { DateTimePicker } from '../BuilderForm/components/DateTimePicker'
import { AddEditTimeS } from '../BuilderForm/schemas/main.schema'
import { Button } from '../Button'

import { ModalContainer } from './_ModalContainer'

export const ModalEditVisitDateTime = ({
	opened,
	close,
	title,
	vPid = '',
	visitDate,
}: {
	opened: boolean
	close: () => void
	title: string
	vPid: string
	visitDate: { timeFrom: string; timeTo: string }
}) => {
	const t = useT()
	const f = useForm(AddEditTimeS)
	useEffect(() => {
		f.setValue('timeFrom', new Date(visitDate.timeFrom))
		f.setValue('timeTo', new Date(visitDate.timeTo))
	}, [f, visitDate.timeFrom, visitDate.timeTo])
	return (
		<ModalContainer
			opened={opened}
			onClose={() => {
				f.setValue('timeFrom', new Date(visitDate.timeFrom))
				f.setValue('timeTo', new Date(visitDate.timeTo))
				close()
			}}
			title={title}
		>
			<form className="flex flex-col gap-3">
				<DateTimePicker id="timeFrom" form={f} placeholder={t('t.timeFrom')} />
				<DateTimePicker id="timeTo" form={f} placeholder={t('t.timeTo')} />
				<Button
					title={t('confirm')}
					onPress={() =>
						f.handleSubmit(async (body) => {
							const visit = await API_PATCH_ProviderVisit(vPid, {
								timeFrom: body.timeFrom.toISOString(),
								timeTo: body.timeTo.toISOString(),
							})
							useStateData.getState().setVisit(visit)
							close()
						})()
					}
				/>
			</form>
		</ModalContainer>
	)
}

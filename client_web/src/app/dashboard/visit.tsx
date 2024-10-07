import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mariuzm/form'
import { getGpsPromise } from '@mariuzm/utils'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import { API_POST_VisitAction } from '../../apis/entities/visits.api.entity'
import type { GetWorkerVisitT } from '../../apis/types/entities.api.type'
import { DateTimePicker } from '../../components/BuilderForm/components/DateTimePicker'
import { AddEditTimeS } from '../../components/BuilderForm/schemas/main.schema'
import { Button } from '../../components/Button'
import { ModalAddSignature } from '../../components/Modals/ModalAddSignature'
import { ModalAddTime } from '../../components/Modals/ModalAddTime'
import { ModalCancelVisit } from '../../components/Modals/ModalCancelVisit'
import { ModalEditVisitDateTime } from '../../components/Modals/ModalEditVisitDateTime'
import { ModalVisitInProgress } from '../../components/Modals/ModalVisitInProgress'
import { ObjView } from '../../components/ObjView'
import { toastErr } from '../../components/Toast'
import { useStateData } from '../../states/data.state'
import { useT } from '../../utils/i18n.util'

export const ProviderVisitPage = () => {
	const { visit } = useLoaderData() as { visit: GetWorkerVisitT } as any
	const sVisit = useStateData((s) => s.visit)
	const [m, sm] = useDisclosure(false)
	const [mEditDateTime, smEditDateTime] = useDisclosure(false)
	const [mDel, smDel] = useDisclosure(false)
	const f = useForm(AddEditTimeS)
	const t = useT()

	useEffect(() => {
		useStateData.getState().setVisit(visit)
		return () => useStateData.getState().setVisit(null)
	}, [visit])

	if (!sVisit) return null

	return (
		<div>
			<div className="mb-4 flex justify-between">
				<div className="flex gap-4">
					{sVisit?.status !== 'CANCELLED' && (
						<Button title={t('addTime')} onPress={() => sm.open()} />
					)}
					<Button
						title={t('editVisitDateAndTime')}
						onPress={() => smEditDateTime.open()}
						color="primary"
					/>
				</div>
				{sVisit?.status === 'NOT_STARTED' && (
					<Button title={t('cancelVisit')} onPress={() => smDel.open()} color="danger" />
				)}
			</div>
			<ObjView data={sVisit as any} />
			<ModalAddTime
				opened={m}
				title={t('addTime')}
				close={sm.close}
				Form={() => (
					<form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						<DateTimePicker id="timeFrom" form={f} placeholder={t('t.timeFrom')} />
						<DateTimePicker id="timeTo" form={f} placeholder={t('t.timeTo')} />
						<Button
							title={t('create')}
							onPress={() =>
								f.handleSubmit(async (body) => {
									await API_POST_VisitAction({
										vPid: sVisit.pid,
										status: 'PROVIDER_ADD_TIME',
										body,
									})
									sm.close()
								})()
							}
						/>
					</form>
				)}
			/>
			<ModalEditVisitDateTime
				title={t('editVisitDateAndTime')}
				opened={mEditDateTime}
				close={smEditDateTime.close}
				vPid={sVisit.pid}
				visitDate={{ timeFrom: sVisit.timeFrom, timeTo: sVisit.timeTo }}
			/>
			<ModalCancelVisit
				title={t('cancelVisitConfirm')}
				opened={mDel}
				close={smDel.close}
				vPid={sVisit.pid}
			/>
		</div>
	)
}

export const WorkerVisitPage = () => {
	const sVisit = useStateData((s) => s.visit)
	const [m, sm] = useDisclosure(false)
	const [m2, sm2] = useDisclosure(false)
	const [vPid, setVPid] = useState('')
	const t = useT()

	useEffect(() => {
		return () => useStateData.getState().setVisit(null)
	}, [])

	if (!sVisit) return null

	const onButtonPress = async ({
		action,
		sig,
		pos,
	}: {
		action: 'STARTED' | 'PAUSED' | 'ENDED'
		sig?: string
		pos?: { lat: number; lon: number }
	}) => {
		let body = {}
		if (action === 'STARTED' && pos) {
			body = { pos }
		} else if (action === 'ENDED' && sVisit?.recipient.approveBy === 'signature' && sig) {
			body = { sig }
		}
		await API_POST_VisitAction({
			vPid: sVisit.pid,
			status: action,
			body,
			openVisitModal: sm2.open,
			setVPid,
		})
	}

	return (
		<div>
			<div className="mb-4 flex gap-4">
				<Button
					title={t('start')}
					onPress={async () => {
						try {
							const p = await getGpsPromise()
							if (p.latitude || p.longitude) {
								onButtonPress({ action: 'STARTED', pos: { lat: p.latitude, lon: p.longitude } })
							} else toastErr('Location not found')
						} catch (e) {
							toastErr(e as string)
						}
					}}
				/>
				<Button title={t('pause')} onPress={() => onButtonPress({ action: 'PAUSED' })} />
				<Button
					title={t('end')}
					onPress={() => {
						sVisit?.recipient.approveBy === 'signature'
							? sm.open()
							: onButtonPress({ action: 'ENDED' })
					}}
				/>
			</div>
			<ObjView data={sVisit as any} />
			<ModalVisitInProgress
				title={t('visitInProgress')}
				opened={m2}
				close={sm2.close}
				vPid={vPid}
			/>
			<ModalAddSignature
				title={t('addSignature')}
				opened={m}
				close={sm.close}
				onApprove={onButtonPress}
			/>
		</div>
	)
}

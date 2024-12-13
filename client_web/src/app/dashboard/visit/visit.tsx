import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mariuzm/form'
import { formatDate, getGpsPromise } from '@mariuzm/utils'
import { createRef, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import moment from 'moment'

import { API_POST_VisitAction } from '../../../apis/entities/visits.api.entity'
import type { GetWorkerVisitT } from '../../../apis/types/entities.api.type'
import { DateTimePicker } from '../../../components/BuilderForm/components/DateTimePicker'
import { AddEditTimeS } from '../../../components/BuilderForm/schemas/main.schema'
// import { Button } from '../../../components/Button'
import { ModalAddSignature } from '../../../components/Modals/ModalAddSignature'
import { ModalAddTime } from '../../../components/Modals/ModalAddTime'
import { ModalCancelVisit } from '../../../components/Modals/ModalCancelVisit'
import { ModalEditVisitDateTime } from '../../../components/Modals/ModalEditVisitDateTime'
import { ModalVisitInProgress } from '../../../components/Modals/ModalVisitInProgress'
import { ObjView } from '../../../components/ObjView'
import { toastErr } from '../../../components/Toast'
import { useStateData } from '../../../states/data.state'
import { t, useT } from '../../../utils/i18n.util'
import { Header } from '@/components/header'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Calendar, ChartNoAxesColumnIncreasing, Check, CopyCheck, NotebookPen } from 'lucide-react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ExpandableCard from '@/components/ExpandableCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import SignaturePad from 'react-signature-pad-wrapper'
import SignatureDialog from '@/components/SignatureModal'

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

const visitStatusConfig: Record<string, string> = {
	"NOT_STARTED": "bg-[#E8E5E5] text-[#79797A]",
	"STARTED": "bg-[#D8E8F6] text-[#1E77CA]",
	"PAUSED": "bg-[#E8E5E5] text-[#626263]",
	"APPROVED": "bg-[#E0F6E7] text-[#0FAA43]",
};

const actionButtonsConfig = {
	NOT_STARTED: [
		{ text: 'Pradeti', action: 'STARTED', className: "w-full bg-primary text-white" },
	],
	STARTED: [
		{ text: 'Stabdyti', action: 'PAUSED', className: "w-full bg-[#CFD4DF] text-black" },
		{ text: 'Baigti', action: 'ENDED', className: "w-full bg-[#0FAA43] text-white" }
	],
	PAUSED: [
		{ text: 'Testi', action: 'STARTED', className: "w-full bg-primary text-white" },
		{ text: 'Baigti', action: 'ENDED', className: "w-full bg-[#0FAA43] text-white" }
	],
} as const;

export const WorkerVisitPage = () => {
	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const sVisit = useStateData((s) => s.visit)
	const t = useT()
	const navigate = useNavigate()

	useEffect(() => {
		if (sVisit && sVisit.status === 'APPROVED') {
			navigate('/worker/dashboard/visits')
		}
		return () => useStateData.getState().setVisit(null)
	}, [sVisit, navigate])

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
			vPid: sVisit!.pid,
			status: action,
			body,
		})
	}

	const handleServiceToggle = (serviceId: string) => {
		setSelectedServices(prev => 
		  prev.includes(serviceId) 
			? prev.filter(id => id !== serviceId)
			: [...prev, serviceId]
		);
	};

	return (
		<div className="flex flex-col h-screen">
			<Header title={t('menu.visits')} />
			<div className="flex-1 flex flex-col gap-8 p-4">
				<Card className="border border-primary overflow-hidden rounded-md">
					<CardContent className="p-0">
						<div className="flex justify-between items-center p-6">
							<div className="flex flex-col items-center gap-2">
								<div className="flex items-center gap-2">
									<Calendar className="size-6" />
									<span className="text-sm font-bold">2024-12-10</span>
								</div>
								<div>
									<span className="text-sm">
										{moment(sVisit.timeFrom).format('HH:mm')} - {moment(sVisit.timeTo).format('HH:mm')}
									</span>
								</div>
							</div>
							<div className="flex flex-col items-center gap-2">
								<div className="flex items-center gap-2">
									<ChartNoAxesColumnIncreasing className="size-6" />
									<span className="text-sm font-bold">Statusas</span>
								</div>
								<div className={cn(
									"rounded-md px-4 py-2 w-full text-center text-sm font-bold",
									visitStatusConfig[sVisit.status]
								)}>
									{t(`s.${sVisit.status}` as 's')}
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2 px-6 pb-4">
							<div className="flex justify-center items-center gap-2">
								<Clock className="size-6" />
								<span className="text-2xl font-bold">15:00</span>
							</div>
							<div className="bg-primary rounded-md py-1 w-full">
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t border-primary px-6 py-4 justify-between">
						<div className="font-bold">
							{t('t.recipient')}
						</div>
						<div>
							{sVisit.recipient.fullName}
						</div>
					</CardFooter>
				</Card>
				<ExpandableCard title="Kategorijos" icon={CopyCheck} variant='card'>
					{sVisit.recipient.categories?.map((category) => (
						<ExpandableCard title={category.name} variant='category'>
							<div className="px-6">
								{category.services.map((service) => (
									<div 
										className={`border border-gray-300 text-black p-2 rounded-md mb-2 last:mb-0 ${
											selectedServices.includes(service.pid) ? 'bg-primary text-white' : ''
										}`} 
										onClick={() => handleServiceToggle(service.pid)}
									>
										<div className="flex items-center justify-between">
											<span>{service.name}</span>
											{selectedServices.includes(service.pid) && (
												<Check className="size-5" />
											)}
										</div>
									</div>
								))}
							</div>
						</ExpandableCard>
					)) ?? <div className="px-6">Kategorijos nepridėtos</div>}
				</ExpandableCard>
				<ExpandableCard title="Pastabos" icon={NotebookPen} variant='card'>
					<div className="px-6 pt-4">
						{sVisit.recipient.notes}
					</div>
				</ExpandableCard>
			</div>
			<div className="sticky bottom-0 p-6 flex flex-col justify-center items-center gap-4">
				{actionButtonsConfig[sVisit.status as keyof typeof actionButtonsConfig]?.map((btn, idx) => (
					sVisit?.recipient.approveBy === 'signature' && btn.action === 'ENDED' ? (
						<SignatureDialog 
							key={idx}
							onSubmit={(signature) => onButtonPress({ action: btn.action as any, sig: signature })} 
						/>
					) : (
						<Button 
							key={idx}
							className={btn.className}
							size="lg"
							onClick={() => onButtonPress({ action: btn.action as any })}
						>
							{btn.text}
						</Button>
					)
				))}
			</div>
		</div>
	)
}

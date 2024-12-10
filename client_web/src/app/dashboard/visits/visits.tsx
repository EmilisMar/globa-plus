import { useEffect, useState } from 'react'
import { useForm } from '@mariuzm/form'

import { API_POST_Visit } from '../../../apis/entities/visits.api.entity'
import { WorkerVisitT } from '../../../apis/types/entities.api.type'
import { Checkbox } from '../../../components/BuilderForm/components/Checkbox'
import { DateTimePicker } from '../../../components/BuilderForm/components/DateTimePicker'
import { SelectAPI } from '../../../components/BuilderForm/components/Select/Select'
import { AddVisitS } from '../../../components/BuilderForm/schemas/main.schema'
import { toastSuccess } from '../../../components/Toast'
import { useStateUser } from '../../../states/user.state'
import { useT } from '../../../utils/i18n.util'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { filterConfig } from './filters'
import { DataTable } from '@/components/ui/data-table/data-table'
import { API_GET_Detail, API_GET_Table } from '@/apis/entities/_main.api'
import { ChevronRight, Clock, Loader2, User } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'

// const visitStatuses: WorkerVisitT['status'][] = [
// 	'NOT_STARTED',
// 	'STARTED',
// 	'PAUSED',
// 	'CANCELLED',
// 	'ENDED',
// ]

const formatDate = (date: string) => {
	const d = new Date(date)
	return d.toISOString().split('T')[0]
}

export const VisitsPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [visits, setVisits] = useState<any[]>([]);

	useEffect(() => {
		const fetchVisits = async () => {
			const visits = await API_GET_Table('visits');
			setVisits(visits);
			setIsLoading(false);
		}
		fetchVisits();
	}, [])
	// const isWorker = useStateUser((s) => s.user?.role === 'worker')
	const t = useT()
	const today = new Date().toLocaleString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })
	const isMobile = useIsMobile();

	console.log(visits)

	return (
		<div className="relative flex flex-col h-full">
			<Header title={t('menu.visits')}>
				<p className="text-sm text-muted-foreground hidden md:block">
					{today}
				</p>
			</Header>
			{isLoading ? (
				<div className="flex flex-1 flex-col justify-center items-center">
					<Loader2 className="animate-spin size-10 text-primary" />
				</div>
			) : isMobile ? (
				<div className="flex flex-1 flex-col gap-4 p-4">
					{visits.map((visit) => (
						<Card 
							key={visit.pid} 
							className="border-2 border-primary overflow-hidden rounded-md"
						>
							<CardContent className="p-0">
								<div className="flex justify-between items-stretch">
									<div className="w-4/5 p-4">
										<div className="flex items-center gap-4">
											<User className="size-6" />
											<span className="text-sm font-bold">{visit.recipient}</span>
										</div>
										<div className="flex items-center gap-4 mt-2">
											<Clock className="size-6" />
											<div className="flex flex-col">
												<span className="text-sm font-bold">
													{formatDate(visit.timeFrom)}
												</span>
												<span className="text-sm">
													{new Date(visit.timeFrom).toLocaleTimeString([], { 
														hour: '2-digit', 
														minute: '2-digit' 
													})}
												</span>
											</div>
										</div>
									</div>
									<div className="w-1/5 flex items-center justify-center bg-primary text-primary-foreground">
										<ChevronRight className="size-7" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="grid auto-rows-min gap-4 md:grid-cols-1">
						<DataTable columns={columns} data={visits} filters={filterConfig} />
					</div>
				</div>
			)}
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

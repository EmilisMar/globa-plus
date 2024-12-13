import { useMemo, useState } from 'react'
import { useT } from '../../../utils/i18n.util'
import { Header } from '@/components/header'
import { DataTable } from '@/components/ui/data-table/data-table'
import { ChevronRight, Clock, User } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { Visit } from '@/types/data-table'
import moment from 'moment'
import LoadingScreen from '@/components/LoadingScreen'
import { useVisits } from '@/hooks/use-visits'
import { getColumns } from './columns'
import { TableNamesT } from '@/apis/types/entities.api.type'
import { endOfMonth } from '@/utils/date.util'
import { startOfMonth } from '@/utils/date.util'
import { endOfWeek } from '@/utils/date.util'
import { startOfWeek } from '@/utils/date.util'
import { endOfDay } from '@/utils/date.util'
import { DateValue } from '@mantine/dates'
import { startOfDay } from '@/utils/date.util'
import { SelectBase } from '@/components/BuilderForm/components/Select/Select'

export const VisitsPage = () => {
	const { visits, isLoading, error, isWorker, refetch } = useVisits();
	const [selectedTimeframe, setSelectedTimeframe] = useState<string>('');
	const columns = useMemo(() => getColumns(isWorker), [isWorker]);
	const t = useT()
	const isMobile = useIsMobile();

	const today = useMemo(() => {
		return new Date().toLocaleString('lt-LT', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}, []);

	const handleFilterChange = async (
		k: string,
		v: string | null,
		tableName: TableNamesT | undefined,
		dateValues?: { dateFrom: string, dateEnd: string }
	) => {
		if (tableName) {
			const params = new URLSearchParams(window.location.search)

			if (dateValues) {
				params.set('dateFrom', dateValues.dateFrom)
				params.set('dateEnd', dateValues.dateEnd)
			} else if (v) {
				params.set(k, v)
			}

			window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
			refetch();
		}
	}

	const handleDateFilter = (val: [Date | null, Date | null]) => {
		if (val[0] && val[1]) {
			const dateFrom = new Date(val[0]);
			dateFrom.setHours(0, 0, 0, 0);
			const formattedDateFrom = `${dateFrom.getFullYear()}-${String(dateFrom.getMonth() + 1).padStart(2, '0')}-${String(dateFrom.getDate()).padStart(2, '0')}`;

			const dateEnd = new Date(val[1]);
			dateEnd.setHours(23, 59, 59, 999);
			const formattedDateEnd = `${dateEnd.getFullYear()}-${String(dateEnd.getMonth() + 1).padStart(2, '0')}-${String(dateEnd.getDate()).padStart(2, '0')}`;

			handleFilterChange('', null, 'visits', { dateFrom: formattedDateFrom, dateEnd: formattedDateEnd })
		}
	}

	if (isLoading) return <LoadingScreen />;
	if (error) return <div>{error.message}</div>;

	return (
		<div className="relative flex flex-col h-full">
			<Header title={t('menu.visits')}>
				<p className="text-sm text-muted-foreground hidden md:block">
					{today}
				</p>
			</Header>
			
			<div className="flex flex-1 flex-col gap-4 p-4">
			<SelectBase
				placeholder={t('selectTimeframe')}
				value={selectedTimeframe}
				options={[
					{ value: 'today', label: t('timeframe.today') },
					{ value: 'week', label: t('timeframe.thisWeek') },
					{ value: 'month', label: t('timeframe.thisMonth') },
					{ value: 'all', label: t('showAll') },
				]}
							onChange={(val) => {
								setSelectedTimeframe(val as any);
								let dateFrom: DateValue | null = null
								let dateEnd: DateValue | null = null
								if (val === 'today') {
									dateFrom = startOfDay(new Date())
									dateEnd = endOfDay(new Date())
								}
								if (val === 'week') {
									dateFrom = startOfWeek(new Date())
									dateEnd = endOfWeek(new Date())
								}
								if (val === 'month') {
									dateFrom = startOfMonth(new Date())
									dateEnd = endOfMonth(new Date())
								}
								if (val === 'all') {
									dateFrom = null
									dateEnd = null
								}
								if (dateFrom && dateEnd) {
									handleDateFilter([dateFrom, dateEnd])
								} else {
									window.location.reload()
									setSelectedTimeframe('');
								}
							}}
						/>
				<DataTable 
					columns={columns} 
					data={visits} 
					isMobile={isMobile}
				/>
			</div>
		</div>
	);
}

export const VisitCard = ({ visit }: { visit: Visit }) => {
	const navigate = useNavigate();

	return (
		<Card 
			key={visit.pid}
			className="border-2 border-primary overflow-hidden rounded-md cursor-pointer"
			onClick={() => navigate(`/worker/dashboard/visits/${visit.pid}`)}
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
									{moment(visit.timeFrom).format('YYYY-MM-DD')}
								</span>
								<span className="text-sm">
									{moment(visit.timeFrom).format('HH:mm')}
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
	)
};

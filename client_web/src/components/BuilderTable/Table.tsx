import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startOfDay } from '@fullcalendar/core/internal'
import { Table as MTable } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { formatCamelToSnake, textFormat } from '@mariuzm/utils'

import { API_GET_Detail, API_GET_Table } from '../../apis/entities/_main.api'
import type { TableNamesT } from '../../apis/types/entities.api.type'
import { Color, Style } from '../../styles/base.style'
import { endOfDay, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from '../../utils/date.util'
import { lo, useT } from '../../utils/i18n.util'
import { SelectBase, SelectBaseAPIV2 } from '../BuilderForm/components/Select/Select'
import { Button } from '../Button'
import { DateRange } from '../DateRange'
import { ModalAddEntity } from '../Modals/ModalAddEntity'

import { COL_NAMES_OBJ } from './schemas/table.schema'

export const Table = ({
	tableName,
	modalTitle,
	modalTitleEdit,
	Form,
	items,
	isDetail,
	isTimeframeFilter,
	isEditable,
	status,
	isVisit,
	isProvider,
}: {
	tableName?: TableNamesT
	modalTitle?: string
	modalTitleEdit?: string
	Form?: React.FC
	items?: any[]
	isDetail?: boolean
	isTimeframeFilter?: boolean
	isEditable?: boolean
	status?: { value: string; label: string }[]
	isVisit?: boolean
	isProvider?: boolean
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [cols, setCols] = useState<string[]>([])
	const [rows, setRows] = useState<any[]>([])
	const [modal, setModal] = useDisclosure(false)
	const [editPid, setEditPid] = useState<Record<string, any> | null>(null)
	const hideCols = ['pid', 'workerPid'] as string[]
	const nav = useNavigate()
	const t = useT()

	useEffect(() => {
		const main = async () => {
			const data = items || (tableName && (await API_GET_Table(tableName)))
			if (data) {
				setRows(data)
				if (data.length) setCols(Object.keys(data[0]))
			}
			setIsLoading(false)
		}
		main()
	}, [items, tableName])

	const handleFilterChange = async (
		k: string,
		v: string | null,
		tableName: TableNamesT | undefined,
		setRows: (rows: any[]) => void,
		setCols: (cols: string[]) => void,
		dateValues?: { dateFrom: string, dateEnd: string }
	) => {
		if (tableName) {
			const params = new URLSearchParams(window.location.search)

			if (dateValues) {
				// Set both dateFrom and dateEnd if dateValues are provided, called once
				params.set('dateFrom', dateValues.dateFrom)
				params.set('dateEnd', dateValues.dateEnd)
			} else if (v) {
				params.set(k, v)
			}

			// Update the URL with the new parameters
			window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)

			// Fetch new data based on the updated filters
			const newData = await API_GET_Table(tableName)
			if (newData) {
				setRows(newData)
				if (newData.length) setCols(Object.keys(newData[0]))
			}
		}
	}

	const handleDateFilter = (val: [Date | null, Date | null]) => {
		if (val[0] && val[1]) {
			// Set dateFrom to the start of the day (00:00:00)
			const dateFrom = new Date(val[0]);
			dateFrom.setHours(0, 0, 0, 0);
			const formattedDateFrom = `${dateFrom.getFullYear()}-${String(dateFrom.getMonth() + 1).padStart(2, '0')}-${String(dateFrom.getDate()).padStart(2, '0')}`;

			// Set dateEnd to the end of the day (23:59:59)
			const dateEnd = new Date(val[1]);
			dateEnd.setHours(23, 59, 59, 999);
			const formattedDateEnd = `${dateEnd.getFullYear()}-${String(dateEnd.getMonth() + 1).padStart(2, '0')}-${String(dateEnd.getDate()).padStart(2, '0')}`;

			handleFilterChange('', null, tableName, setRows, setCols, { dateFrom: formattedDateFrom, dateEnd: formattedDateEnd })
		}
	}


	return (
		<div>
			<div className="mb-1 flex w-full flex-wrap items-center justify-between">
				{tableName && (
					<h1 style={{ color: Color.PrimaryDark, fontSize: 32, fontWeight: 'bold' }}>
						{lo[tableName] || textFormat(formatCamelToSnake(tableName))}
					</h1>
				)}
				<div style={{ display: 'flex', gap: 8 }}>
					{isTimeframeFilter && (
						<SelectBase
							placeholder={t('selectTimeframe')}
							options={[
								{ value: 'today', label: t('timeframe.today') },
								{ value: 'week', label: t('timeframe.thisWeek') },
								{ value: 'month', label: t('timeframe.thisMonth') },
								{ value: 'all', label: t('showAll') },
							]}
							onChange={(val) => {
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
									//TODO this can be handled better
									window.location.reload()
								}
							}}
						/>
					)}

					{(isVisit || tableName === 'reports') && (
						<div className="flex w-fit flex-row gap-2">
							{isVisit && isProvider && (
								<>
									<SelectBaseAPIV2
										entity="workers"
										placeholder={t('t.workers')}
										onChange={(val) =>
											handleFilterChange('workerPid', val, tableName, setRows, setCols)
										}
									/>
									<SelectBaseAPIV2
										entity="recipients"
										placeholder={t('t.recipients')}
										onChange={(val) =>
											handleFilterChange('recipientPid', val, tableName, setRows, setCols)
										}
									/>
								</>
							)}
							<DateRange
								placeholder={t('t.dateFromTo')}
								onChange={(val) => {
									handleDateFilter(val)
								}}
							/>
							{isVisit &&
								<SelectBase
									placeholder={t('t.status')}
									options={status?.map((s) => ({ value: s.value, label: s.label })) || []}
									onChange={(val) => handleFilterChange('status', val, tableName, setRows, setCols)}
								/>
							}
						</div>
					)}
					{modalTitle && Form && (
						<Button
							title={modalTitle}
							onPress={() => {
								setModal.open()
								editPid && setEditPid(null)
							}}
						/>
					)}
				</div>
			</div>

			{isLoading ? (
				<div>Loading</div>
			) : (
				<>
					{cols.length > 0 ? (
						<MTable.ScrollContainer
							minWidth={400}
							style={{
								backgroundColor: Color.PrimaryLight,
								borderRadius: Style.Radius,
								color: Color.Text,
							}}
						>
							<MTable
								borderColor={Color.Primary}
								highlightOnHover
								highlightOnHoverColor={Color.PrimaryLight}
								stickyHeader
								stripedColor={Color.Primary}
							>
								<MTable.Thead style={{ backgroundColor: Color.Primary, color: Color.Text }}>
									<MTable.Tr>
										{cols.map((col, i) => {
											if (hideCols.includes(col)) return null
											return (
												<MTable.Th key={i}>
													{lo[col] || textFormat(formatCamelToSnake(col))}
												</MTable.Th>
											)
										})}
									</MTable.Tr>
								</MTable.Thead>
								<MTable.Tbody>
									{rows.map((row, i) => {
										return (
											<MTable.Tr
												key={i}
												style={{ borderColor: Color.Primary, cursor: 'pointer' }}
												onClick={async () => {
													if (isDetail) {
														nav(`${row.pid}`)
													}
													if (isEditable && tableName) {
														setEditPid(await API_GET_Detail(tableName, row.pid))
														setModal.open()
													}
												}}
											>
												{cols.map((col, _i) => {
													if (hideCols.includes(col)) return null
													const v = COL_NAMES_OBJ[col]
													return (
														<MTable.Td key={_i} styles={{ td: { color: Color.Text } }}>
															{v?.formater ? v.formater(row[col]) : row[col]}
														</MTable.Td>
													)
												})}
											</MTable.Tr>
										)
									})}
								</MTable.Tbody>
							</MTable>
						</MTable.ScrollContainer>
					) : (
						<div>{t('noData')}</div>
					)}
				</>
			)}
			{modalTitle && Form && (
				<ModalAddEntity
					opened={modal}
					close={setModal.close}
					title={editPid ? modalTitleEdit || '' : modalTitle}
					Form={Form({ item: editPid })}
				/>
			)}
		</div>
	)
}

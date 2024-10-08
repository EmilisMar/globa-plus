import { Table as MTable } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { formatCamelToSnake, textFormat } from '@mariuzm/utils'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endOfMonth, endOfDay, startOfMonth, startOfWeek, endOfWeek } from '../../utils/date.util'
import { API_GET_Detail, API_GET_Table } from '../../apis/entities/_main.api'
import type { TableNamesT } from '../../apis/types/entities.api.type'
import { Color, Style } from '../../styles/base.style'
import { lo, useT } from '../../utils/i18n.util'
import { Button } from '../Button'
import { MonthPickerPopover } from '../Inputs/MonthPicker/MonthPicker'
import { ModalAddEntity } from '../Modals/ModalAddEntity'
import {TimeframeSelect } from '../Inputs/TimeframeSelect/TimeframeSelect'
import { COL_NAMES_OBJ } from './schemas/table.schema'
import { startOfDay } from '@fullcalendar/core/internal'

export const Table = ({
	tableName,
	modalTitle,
	modalTitleEdit,
	Form,
	items,
	isDetail,
	isDateFilter,
	isTimeframeFilter,
	isEditable,
}: {
	tableName?: TableNamesT
	modalTitle?: string
	modalTitleEdit?: string
	Form?: React.FC
	items?: any[]
	isDateFilter?: boolean
	isDetail?: boolean
	isTimeframeFilter? : boolean
	isEditable?: boolean
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [cols, setCols] = useState<string[]>([])
	const [rows, setRows] = useState<any[]>([])
	const [dateFrom, setDateFrom] = useState<DateValue>(isTimeframeFilter ? startOfDay(new Date()) : null)
	const [dateEnd, setDateEnd] = useState<DateValue>(isTimeframeFilter ? endOfDay(new Date()) : null)
	const [timeframe, setTimeframe] = useState<string | null>('today');
	const [modal, setModal] = useDisclosure(false)
	const [editPid, setEditPid] = useState<Record<string, any> | null>(null)
	const hideCols = ['pid', 'workerPid'] as string[]
	const nav = useNavigate()
	const t = useT()

	const handleTimeframe = useCallback((value : string | null) => {
		switch (value) {
			case 'today':
				setDateFrom(startOfDay(new Date()))
				setDateEnd(endOfDay(new Date()));
				break;
			case 'week':
				setDateFrom(startOfWeek(new Date()));
				setDateEnd(endOfWeek(new Date()));
				break;
			case 'month':
				setDateFrom(startOfMonth(new Date()));
				setDateEnd(endOfMonth(new Date()));
				break;
			case 'all':
				setDateFrom(null); // or your logic for 'all' (e.g., no filtering)
				setDateEnd(null);
				break;
			default:
				// Handle any additional cases or errors
				break;
		}

		setTimeframe(value)
	}, [])

	useEffect(() => {
		const main = async () => {
			const data =
				items || (tableName && (await API_GET_Table(tableName, dateFrom, dateEnd)))
			if (data) {
				setRows(data)

				if (data.length) {
					setCols(Object.keys(data[0]))
				}
			}
			setIsLoading(false)
		}
		main()
	}, [dateFrom, dateEnd, items, tableName])

	const handleMonthDate = useCallback((date : DateValue) => {
		setDateFrom(startOfMonth(date));
		setDateEnd(endOfMonth(date))
	}, [])


	return (
		<div>
			<div className="mb-1 flex w-full flex-wrap items-center justify-between">
				{tableName && (
					<h1 style={{ color: Color.PrimaryDark, fontSize: 32, fontWeight: 'bold' }}>
						{lo[tableName] || textFormat(formatCamelToSnake(tableName))}
					</h1>
				)}
				<div style={{ display: 'flex', gap: 8 }}>
					{isDateFilter && <MonthPickerPopover value={dateFrom} setValue={handleMonthDate} />}
					{isTimeframeFilter && <TimeframeSelect value={timeframe} onChange={handleTimeframe} />}
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

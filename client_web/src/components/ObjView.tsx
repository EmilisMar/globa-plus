import { InputWrapper } from '@mantine/core'
import { formatCamelToSnake, isArr, textFormat } from '@mariuzm/utils'

import { API_POST_VisitAction } from '../apis/entities/visits.api.entity'
import { useStateData } from '../states/data.state'
import { Color, Style } from '../styles/base.style'
import { lo } from '../utils/i18n.util'

import { COL_NAMES_OBJ } from './BuilderTable/schemas/table.schema'
import { Table } from './BuilderTable/Table'
import { Checkbox } from './Inputs/Checkbox'

type ObjValT = string | number | boolean | null
type ObjT = { [key: string]: ObjValT }

export const ObjView = ({ data }: { data: ObjT }) => {
	return (
		<div>
			{Object.entries(data).map(([k, v]) => {
				if (k === 'pid' || k === 'country' || k === 'password' || k === 'createdBy') return null
				if (k === 'categories') return <C key={k} k={k} v={v} />
				const cn = COL_NAMES_OBJ[k]
				const isObj = typeof v === 'object'
				return (
					<div
						key={k}
						style={{
							backgroundColor: isObj ? 'white' : Color.PrimaryLight,
							borderRadius: Style.Radius,
							display: isObj ? 'block' : 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							marginBottom: 8,
							padding: isObj ? 0 : 8,
						}}
					>
						<p
							style={{
								alignContent: 'center',
								color: Color.PrimaryDark,
								fontSize: isObj ? 16 : 14,
							}}
						>
							{lo[k] || textFormat(formatCamelToSnake(k))}
						</p>
						<div style={{ color: 'black' }}>
							<Item k={k} v={cn && cn.formater ? cn.formater(v) : v} />
						</div>
					</div>
				)
			})}
		</div>
	)
}

type ItemPropsT = { k: string; v: ObjValT }
const Item = ({ k, v }: ItemPropsT) => {
	if (v === null) {
		return null
	}
	if (typeof v === 'object' && !isArr(v)) {
		return <ObjView data={v as ObjT} />
	}
	if (isArr(v) && k === 'visitLogs') {
		return <Table items={v} />
	}
	if (isArr(v)) {
		return (
			<div>
				{v.map((item, i) => (
					<Item key={i} k={k} v={item as any} />
				))}
			</div>
		)
	}
	if (typeof v === 'boolean') {
		return <div>{v ? 'Yes' : 'No'}</div>
	}
	if (typeof v === 'number') {
		return <div>{v}</div>
	}
	return <div>{v?.toString()}</div>
}

const C = ({ k, v }: { k: string; v: ObjValT }) => {
	if (!isArr(v)) return null
	return (
		<div>
			<p style={{ alignContent: 'center', color: Color.PrimaryDark, fontSize: 16 }}>
				{lo[k] || textFormat(formatCamelToSnake(k))}
			</p>
			{v.map((p) => {
				if (p.services.length === 0) return null
				return (
					<InputWrapper
						key={p.pid}
						label={lo[p.name] || p.name}
						style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}
					>
						{p.services.map(
							(p: { pid: string; name: string; actionStatus: 'SERVICE_COMPLETED' }) => {
								return (
									<Checkbox
										key={p.pid}
										pid={p.pid}
										label={lo[p.name] || p.name}
										isChecked={!!p.actionStatus}
										onClick={async (sPid: string) => {
											const visit = useStateData.getState().visit
											if (!visit) return
											await API_POST_VisitAction({
												vPid: visit.pid,
												status: p.actionStatus ? 'SERVICE_UNCHECK' : 'SERVICE_COMPLETED',
												sPid: sPid,
												body: {},
											})
										}}
									/>
								)
							},
						)}
					</InputWrapper>
				)
			})}
		</div>
	)
}

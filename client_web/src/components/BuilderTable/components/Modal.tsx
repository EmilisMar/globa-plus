import { Modal as MModal } from '@mantine/core'
import { formatCamelToSnake, textFormat } from '@mariuzm/utils'

import { API_PATCH_VerifyUser } from '../../../apis/auth.api'
import { useStoreModal } from '../../../states/modal.state'
import { Color } from '../../../styles/base.style'
import { lo } from '../../../utils/i18n.util'
import { Switch } from '../../BuilderForm/components/Switch'

export const Modal = ({ opened, close }: { opened: boolean; close: () => void }) => {
	const row = useStoreModal((s) => s.row)
	if (!row) return null
	return (
		<MModal
			opened={opened}
			onClose={close}
			title={row.id || ''}
			centered
			size={'lg'}
			styles={{
				header: { backgroundColor: Color.Primary, color: Color.White, marginBottom: 12 },
				close: { color: Color.White, background: Color.Primary },
				content: { backgroundColor: Color.White },
				body: { paddingLeft: 20, paddingRight: 20 },
			}}
		>
			{Object.entries(row).map(([k, v], i) => {
				if (k === 'password') return null
				return (
					<div key={i} style={{ alignItems: 'center', marginBottom: 12 }}>
						<p style={{ color: Color.PrimaryDark, fontSize: 12 }}>
							{lo[k] || textFormat(formatCamelToSnake(k))}
						</p>
						<Item k={k} v={v} pid={row?.pid} />
					</div>
				)
			})}
		</MModal>
	)
}

const Item = ({
	k,
	v,
	pid,
}: {
	k: string
	v: string | number | boolean | object | unknown
	pid?: string
}) => {
	if (typeof v === 'object') {
		return <div>{JSON.stringify(v)}</div>
	}

	if (typeof v === 'boolean') {
		if (k === 'isProfileVerified') {
			return <Switch val={v} onChangeApi={() => API_PATCH_VerifyUser(pid)} />
		}
		return <div>{v ? 'Yes' : 'No'}</div>
	}

	if (typeof v === 'number') {
		return <div>{v}</div>
	}

	return <div>{v?.toString()}</div>
}

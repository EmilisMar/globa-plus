import { Switch as MSwitch } from '@mantine/core'
import { useState } from 'react'

export const Switch = ({
	val,
	onChangeApi,
}: {
	val: boolean
	onChangeApi?: () => Promise<void>
}) => {
	const [checked, setChecked] = useState(val)
	return (
		<MSwitch
			checked={checked}
			disabled={checked}
			onChange={async (e) => {
				setChecked(e.currentTarget.checked)
				onChangeApi && (await onChangeApi())
			}}
		/>
	)
}

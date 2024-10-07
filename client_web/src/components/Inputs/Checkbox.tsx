import { Checkbox as MCheckbox } from '@mantine/core'
import { useEffect, useState } from 'react'

import { Color } from '../../styles/base.style'

export const Checkbox = ({
	pid,
	label,
	onClick,
	isChecked,
}: {
	pid: string
	label: string
	onClick: (id: string) => void
	isChecked: boolean
}) => {
	const [checked, setChecked] = useState(false)
	useEffect(() => {
		setChecked(isChecked)
	}, [isChecked])
	return (
		<MCheckbox
			label={label}
			onClick={() => onClick(pid)}
			checked={checked}
			onChange={() => setChecked(!checked)}
			color={Color.Primary}
			size="md"
		/>
	)
}

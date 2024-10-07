import { Checkbox as MCheckbox } from '@mantine/core'
import { useState } from 'react'

import { Color, Style } from '../../styles/base.style'

export const CheckboxButton = ({
	pid,
	label,
	onClick,
	isDisabled,
}: {
	pid: string
	label: string
	onClick: (id: string) => void
	isDisabled?: boolean
}) => {
	const [checked, setChecked] = useState(false)
	return (
		<div
			style={{
				borderColor: Color.Primary,
				borderRadius: Style.Radius,
				borderWidth: 1,
				padding: 12,
				width: 'fit-content',
			}}
		>
			<MCheckbox
				label={label}
				onClick={() => onClick(pid)}
				checked={isDisabled || checked}
				onChange={() => setChecked(!checked)}
				disabled={isDisabled}
				color={Color.Primary}
				size="md"
			/>
		</div>
	)
}

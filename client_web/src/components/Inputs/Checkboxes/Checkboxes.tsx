import { Checkbox } from '@mantine/core'
import { useState } from 'react'

import { Color, Style } from '../../../styles/base.style'

export const CheckboxBtn = ({ label }: { label: string }) => {
	const [isClicked, setIsClicked] = useState(false)
	return (
		<div
			onClick={() => setIsClicked(!isClicked)}
			style={{
				alignItems: 'center',
				borderColor: Color.Primary,
				borderRadius: Style.Radius,
				borderWidth: 1,
				cursor: 'pointer',
				display: 'flex',
				gap: 8,
				padding: '12px',
				userSelect: 'none',
				width: 'fit-content',
			}}
		>
			<Checkbox
				checked={isClicked}
				onChange={() => setIsClicked(!isClicked)}
				color={Color.Primary}
			/>
			{label}
		</div>
	)
}

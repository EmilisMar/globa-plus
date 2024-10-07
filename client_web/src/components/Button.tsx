import { Button as MButton } from '@mantine/core'
import { useState } from 'react'

import { Color } from '../styles/base.style'

import { Spinner } from './Loader'

const ColorType: Record<string, string> = {
	primary: Color.Primary,
	danger: Color.Error,
} as const

export const Button = ({
	title,
	onPress,
	type = 'button',
	color = 'primary',
	isSubmitting,
}: {
	title: string
	onPress?: () => Promise<void> | void
	type?: 'submit' | 'button'
	color?: 'primary' | 'secondary' | 'danger'
	isSubmitting?: boolean
}) => {
	const [isLoading, setIsLoading] = useState(false)
	return (
		<MButton
			variant="filled"
			color={ColorType[color]}
			styles={{ label: { gap: '8px' } }}
			type={type}
			disabled={isSubmitting || isLoading}
			style={{
				color: Color.Text,
			}}
			onClick={async () => {
				setIsLoading(true)
				onPress && (await onPress())
				setIsLoading(false)
			}}
		>
			{(isSubmitting || isLoading) && <Spinner />}
			<p>{title}</p>
		</MButton>
	)
}

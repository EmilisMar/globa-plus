import type { ReactNode } from 'react'

import { ModalContainer } from './_ModalContainer'

export const ModalAddEntity = ({
	opened,
	close,
	title,
	Form,
}: {
	opened: boolean
	close: () => void
	title: string
	Form?: ReactNode
}) => {
	if (!Form) return null
	return (
		<ModalContainer opened={opened} onClose={close} title={title}>
			{Form}
		</ModalContainer>
	)
}

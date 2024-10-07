import { Modal } from '@mantine/core'

import { Color } from '../../styles/base.style'

export const ModalContainer = ({
	opened,
	onClose,
	title,
	children,
}: {
	opened: boolean
	onClose: () => void
	title: string
	children: React.ReactNode
}) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={title}
			size="lg"
			styles={{
				header: {
					backgroundColor: Color.PrimaryDark,
					color: Color.White,
				},
				close: {
					color: Color.White,
					background: Color.PrimaryDark,
				},
				content: {
					backgroundColor: Color.Primary,
				},
				body: {
					backgroundColor: Color.White,
					paddingTop: 20,
					paddingLeft: 20,
					paddingRight: 20,
				},
			}}
		>
			{children}
		</Modal>
	)
}

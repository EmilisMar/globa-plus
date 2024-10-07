import { Modal as MModal } from '@mantine/core'

import { Color } from '../../styles/base.style'

export const ModalDetailRow = ({
	opened,
	close,
	title,
	form: Form,
}: {
	opened: boolean
	close: () => void
	title: string
	form?: () => JSX.Element | null | undefined
}) => {
	if (!Form) return null
	return (
		<MModal
			opened={opened}
			onClose={close}
			title={title}
			centered
			size="lg"
			styles={{
				close: {
					color: Color.White,
					background: Color.PrimaryDark,
				},
				header: {
					backgroundColor: Color.Primary,
					color: Color.White,
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
			<Form />
		</MModal>
	)
}

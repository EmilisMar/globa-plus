import { ModalContainer } from './_ModalContainer'

export const ModalAddTime = ({
	opened,
	close,
	title,
	Form,
}: {
	opened: boolean
	close: () => void
	title: string
	Form?: React.FC
}) => {
	if (!Form) return null
	return (
		<ModalContainer opened={opened} onClose={close} title={title}>
			<Form />
		</ModalContainer>
	)
}

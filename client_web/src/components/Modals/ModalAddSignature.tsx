import { createRef } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { Button } from '../Button'

import { ModalContainer } from './_ModalContainer'

export const ModalAddSignature = ({
	opened,
	close,
	title,
	onApprove,
}: {
	opened: boolean
	close: () => void
	title: string
	onApprove: ({ action, sig }: { action: 'ENDED'; sig: string }) => Promise<void>
}) => {
	const ref = createRef<SignaturePad>()
	return (
		<ModalContainer opened={opened} onClose={close} title={title}>
			<div style={{ marginBottom: -20, marginLeft: -20, marginRight: -20 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gap: 8,
						position: 'absolute',
						width: '100%',
					}}
				>
					<Button
						title="Clear"
						onPress={() => {
							ref.current && ref.current.clear()
						}}
					/>
					<Button
						title="Save and Approve"
						onPress={async () => {
							if (ref.current) {
								const sig = ref.current.toDataURL()
								await onApprove({ action: 'ENDED', sig })
								close()
							}
						}}
					/>
				</div>
				<SignaturePad ref={ref} />
			</div>
		</ModalContainer>
	)
}

import { Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { useT } from '../../utils/i18n.util'
import { Button } from '../Button'

import { ModalContainer } from './_ModalContainer'

export const ModalVisitInProgress = ({
	opened,
	close,
	title,
	vPid,
}: {
	opened: boolean
	close: () => void
	title: string
	vPid: string
}) => {
	const nav = useNavigate()
	const t = useT()
	return (
		<ModalContainer opened={opened} onClose={close} title={title}>
			<p style={{ marginBottom: 12 }}>
				<Text>{t('visitInProgressBody')}</Text>
			</p>
			<div style={{ display: 'flex', gap: 8, justifyContent: 'center', width: '100%' }}>
				<Button
					title="Go to Visit"
					onPress={() => {
						close()
						nav(`/worker/dashboard/visits/${vPid}`)
					}}
				/>
			</div>
		</ModalContainer>
	)
}

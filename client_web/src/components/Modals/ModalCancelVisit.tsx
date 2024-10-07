import { API_PATCH_CancelVisit } from '../../apis/entities/visits.api.entity'
import { useStateData } from '../../states/data.state'
import { useT } from '../../utils/i18n.util'
import { Button } from '../Button'

import { ModalContainer } from './_ModalContainer'

export const ModalCancelVisit = ({
	opened,
	close,
	title,
	vPid = '',
}: {
	opened: boolean
	close: () => void
	title: string
	vPid: string
}) => {
	const t = useT()
	return (
		<ModalContainer opened={opened} onClose={close} title={title}>
			<div className="flex justify-evenly">
				<Button title={t('returnBack')} onPress={close} />
				<Button
					title={t('cancelVisit')}
					onPress={async () => {
						const visit = await API_PATCH_CancelVisit(vPid)
						useStateData.getState().setVisit(visit)
						close()
					}}
					color="danger"
				/>
			</div>
		</ModalContainer>
	)
}

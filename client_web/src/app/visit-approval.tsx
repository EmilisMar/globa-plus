import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { API_POST_VisitApproval } from '../apis/entities/visits.api.entity'
import { Spinner } from '../components/Loader'
import { Color } from '../styles/base.style'
import { useT } from '../utils/i18n.util'

export const VisitApprovalPage = () => {
	const { vPid } = useParams<{ vPid: string }>()
	const [isVisitApproved, setIsVisitApproved] = useState(false)
	const t = useT()

	useEffect(() => {
		if (vPid) {
			const main = async () => {
				const data = await API_POST_VisitApproval(vPid)
				if (data) setIsVisitApproved(true)
			}
			main()
		}
	}, [vPid])

	if (isVisitApproved) {
		return (
			<div>
				<h1 style={{ color: Color.Text }}>{t('visit_approved')}</h1>
			</div>
		)
	}

	return (
		<div>
			<Spinner size={70} />
		</div>
	)
}

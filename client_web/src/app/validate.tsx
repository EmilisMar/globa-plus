import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { API_POST_UserLoginValidate } from '../apis/auth.api'
import { Spinner } from '../components/Loader'

export const ValidatePage = () => {
	const { token } = useParams<{ token: string }>()
	const nav = useNavigate()
	useEffect(() => {
		if (token) {
			const main = async () => {
				const data = await API_POST_UserLoginValidate(token)
				if (data.user.role === 'worker') {
					return nav(`/${data.user.role}/dashboard/visits`)
				}
				if (data) {
					nav(`/${data.user.role}/dashboard`)
				}
			}
			main()
		}
	}, [nav, token])
	return (
		<div>
			<Spinner size={70} />
		</div>
	)
}

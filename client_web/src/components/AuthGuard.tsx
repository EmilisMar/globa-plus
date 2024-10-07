import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { API_GET_VerifyToken } from '../apis/auth.api'
import { useStateUser } from '../states/user.state'
import { Color } from '../styles/base.style'
import { getAccessToken } from '../utils/token.util'

import { Spinner } from './Loader'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true)
	const nav = useNavigate()

	useEffect(() => {
		const main = async () => {
			const p = window.location.pathname

			if (p === '/admin') return [setIsLoading(false)]
			if (p.includes('/validate')) return [setIsLoading(false)]
			if (p.includes('/visit-approval')) return [setIsLoading(false)]

			const userToken = await getAccessToken()
			if (!userToken) return [setIsLoading(false), nav('/')]

			const u = useStateUser.getState().user
			const user = u ? u : await API_GET_VerifyToken()
			if (!user) return [setIsLoading(false), nav('/')]

			if (p === '/') {
				if (user.role === 'worker') {
					return [setIsLoading(false), nav(`/${user.role}/dashboard/visits`)]
				}
				return [setIsLoading(false), nav(`/${user.role}/dashboard`)]
			}

			const split = p.split('/')
			split[1] = user.role
			const newPath = split.join('/')
			setIsLoading(false)
			nav(newPath)
		}
		main()
	}, [nav])

	if (isLoading)
		return (
			<div
				style={{
					alignItems: 'center',
					backgroundColor: Color.Primary,
					display: 'flex',
					flexDirection: 'column',
					height: '100vh',
					justifyContent: 'center',
				}}
			>
				<Spinner size={70} />
			</div>
		)

	return children
}

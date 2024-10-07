import { useEffect } from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

export const ErrorBoundary = () => {
	const { status } = useRouteError() as { status: number }
	const nav = useNavigate()
	useEffect(() => {
		if (status === 404) {
			nav('/')
		}
	}, [nav, status])
	return null
}

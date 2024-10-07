import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { getGpsPromise } from '@mariuzm/utils'

import { API_GET_CheckWorkerPos } from '../../apis/entities/workers.api.entity'
import { NavBar } from '../../components/NavBar'
import { useStateUser } from '../../states/user.state'

export const DashboardLayout = () => {
	useEffect(() => {
		const checkWp = async () => {
			const { user } = useStateUser.getState()
			if (!user?.pid) return
			if (user.role === 'worker') {
				const gps = await getGpsPromise()
				await API_GET_CheckWorkerPos(user.pid, gps.latitude, gps.longitude)
			}
		}
		checkWp()
		const intId = setInterval(checkWp, 1000 * 60 * 1)
		return () => clearInterval(intId)
	}, [])
	return (
		<div className="flex flex-row md:flex-col">
			<NavBar />
			<div className="md:pb-[80px]" style={{ height: '100dvh', overflowX: 'auto', width: '100vw' }}>
				<div style={{ padding: 20 }}>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

import { useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { getGpsPromise } from '@mariuzm/utils'

import { API_GET_CheckWorkerPos } from '../../apis/entities/workers.api.entity'
import { useStateUser } from '../../states/user.state'
import { Outlet } from 'react-router-dom'

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
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}

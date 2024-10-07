import { Outlet } from 'react-router-dom'

import { Color } from '../../styles/base.style'

export const AdminLayout = () => {
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
			<Outlet />
		</div>
	)
}

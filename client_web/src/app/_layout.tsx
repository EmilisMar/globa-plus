import { Outlet } from 'react-router-dom'

import { Color } from '../styles/base.style'

export const RootLayout = () => {
	return (
		<div
			style={{
				alignItems: 'center',
				backgroundColor: Color.PrimaryDark,
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

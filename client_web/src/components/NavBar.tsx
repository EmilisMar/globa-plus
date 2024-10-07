import { Tooltip, UnstyledButton } from '@mantine/core'
import { NavLink, useLocation } from 'react-router-dom'

import { ROUTES_NAV } from '../main'
import { Color, Style } from '../styles/base.style'
import { logout } from '../utils/auth.util'
import { t } from '../utils/i18n.util'

import { LogoutIcon } from './Icons'

const ITEM_SIZE = 50

export const NavBar = () => {
	const pn = useLocation().pathname.split('/')[1]
	return (
		<nav
			className="flex h-[100vh] w-[80px] flex-col md:h-[80px] md:w-[100vw] md:flex-row-reverse"
			style={{
				alignItems: 'center',
				backgroundColor: Color.PrimaryDark,
				justifyContent: 'space-between',
				paddingBottom: 20,
				paddingTop: 20,
				position: 'sticky',
				top: 0,
				zIndex: 100,
			}}
		>
			<div className="md:flex">
				{Object.entries(ROUTES_NAV[pn]).map(([k, v]) => {
					return (
						<Tooltip
							key={k}
							label={v.name}
							position="right"
							transitionProps={{ duration: 0 }}
							color={Color.PrimaryDark}
							styles={{ tooltip: { backgroundColor: Color.PrimaryDarkHover, color: Color.White } }}
						>
							<NavLink
								className="active:bg-primary-dark hover:bg-[var(--PrimaryDarkHover)]"
								style={{
									alignItems: 'center',
									borderRadius: Style.Radius,
									color: 'white',
									display: 'flex',
									height: ITEM_SIZE,
									justifyContent: 'center',
									width: ITEM_SIZE,
								}}
								to={`/${pn}/dashboard/${k}`}
							>
								{v.icon}
							</NavLink>
						</Tooltip>
					)
				})}
			</div>
			<Tooltip
				label={t('auth_logout')}
				position="right"
				transitionProps={{ duration: 0 }}
				color={Color.PrimaryDark}
			>
				<UnstyledButton
					className="active:bg-primary-dark hover:bg-[var(--PrimaryDarkHover)]"
					style={{
						alignItems: 'center',
						borderRadius: Style.Radius,
						color: 'white',
						display: 'flex',
						height: ITEM_SIZE,
						justifyContent: 'center',
						width: ITEM_SIZE,
					}}
					onClick={logout}
				>
					<LogoutIcon />
				</UnstyledButton>
			</Tooltip>
		</nav>
	)
}

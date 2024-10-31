import { NavLink, useLocation } from 'react-router-dom'
import { UnstyledButton } from '@mantine/core'

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
			className="flex h-[100vh] flex-col md:h-[80px] md:flex-row-reverse"
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
						<NavLink
							className="active:bg-primary-dark m-2 p-2 hover:bg-[var(--PrimaryDarkHover)]"
							style={{
								alignItems: 'center',
								borderRadius: Style.Radius,
								color: 'white',
								display: 'flex',
								height: ITEM_SIZE,
							}}
							to={`/${pn}/dashboard/${k}`}
						>
							<div>{v.icon}</div>
							<div className="ml-2 whitespace-nowrap md:hidden">{v.name}</div>
						</NavLink>
					)
				})}
			</div>

			<div className="flex w-full px-2">
				<UnstyledButton
					className="active:bg-primary-dark flex w-full items-start p-2 hover:bg-[var(--PrimaryDarkHover)]"
					style={{ borderRadius: Style.Radius, color: 'white' }}
					onClick={logout}
				>
					<LogoutIcon />
					<div className="ml-2 whitespace-nowrap md:hidden">{t('auth_logout')}</div>
				</UnstyledButton>
			</div>
		</nav>
	)
}

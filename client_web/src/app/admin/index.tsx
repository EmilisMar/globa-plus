import { useForm } from '@mantine/form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { API_POST_AdminLogin } from '../../apis/auth.api'
import { AdminLoginS } from '../../components/BuilderForm/schemas/auth.schema'
import { Button } from '../../components/Button'
import { InputText } from '../../components/Inputs/InputText'
import { Color, Style } from '../../styles/base.style'
import { useT } from '../../utils/i18n.util'

export const AdminLoginPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const nav = useNavigate()
	const f = useForm(AdminLoginS)
	const t = useT()
	return (
		<form
			style={{
				backgroundColor: Color.White,
				borderRadius: Style.Radius,
				boxShadow: Style.Shadow,
				display: 'flex',
				flexDirection: 'column',
				gap: 20,
				minWidth: 300,
				padding: 20,
			}}
			onSubmit={f.onSubmit(async (formValues) => {
				setIsLoading(true)
				const data = await API_POST_AdminLogin(formValues)
				if (data) nav(`/admin/dashboard`)
				setIsLoading(false)
			})}
		>
			<h1>{t('admin_signin')}</h1>
			<InputText id="email" form={f} placeholder={t('email')} type="email" />
			<InputText id="password" form={f} placeholder={t('password')} type="password" />
			<Button title={t('signin')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

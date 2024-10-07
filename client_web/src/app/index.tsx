import { useForm } from '@mantine/form'
import { useState } from 'react'

import { API_POST_UserLogin } from '../apis/auth.api'
import { UserLoginS } from '../components/BuilderForm/schemas/auth.schema'
import { Button } from '../components/Button'
import { InputText } from '../components/Inputs/InputText'
import { toastSuccess } from '../components/Toast'
import { Color, Style } from '../styles/base.style'
import { useT } from '../utils/i18n.util'

export const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const f = useForm(UserLoginS)
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
			onSubmit={f.onSubmit(async (form) => {
				setIsLoading(true)
				const data = await API_POST_UserLogin(form.email)
				data && toastSuccess(t('check_email_link'))
				setIsLoading(false)
			})}
		>
			<h1>{t('signin')}</h1>
			<InputText id="email" form={f} placeholder={t('email')} type="email" />
			<Button title={t('email')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

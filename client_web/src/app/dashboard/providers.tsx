import { useForm } from '@mariuzm/form'
import { useState } from 'react'

import { API_POST_Provider } from '../../apis/entities/providers.api.entity'
import { InputText } from '../../components/BuilderForm/components/InputText'
import { AddProviderS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useT } from '../../utils/i18n.util'

export const ProvidersPage = () => {
	const t = useT()
	return <Table tableName="providers" modalTitle={t('createProvider')} Form={Form} />
}

const Form = () => {
	const form = useForm(AddProviderS)
	const [isLoading, setIsLoading] = useState(false)
	const t = useT()
	return (
		<form
			onSubmit={form.handleSubmit(async (formData) => {
				setIsLoading(true)
				const data = await API_POST_Provider(formData)
				if (data) {
					form.reset()
					toastSuccess('Provider created')
				}
				setIsLoading(false)
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			<InputText id="companyName" form={form} placeholder={t('t.companyName')} />
			<InputText id="companyCode" form={form} placeholder={t('t.companyCode')} />
			<InputText id="email" form={form} placeholder={t('email')} />
			<Button title={t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

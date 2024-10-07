import { useForm } from '@mariuzm/form'
import { useState } from 'react'

import { API_POST_Service } from '../../apis/entities/services.api.entity'
import { InputText } from '../../components/BuilderForm/components/InputText'
import { InputTime } from '../../components/BuilderForm/components/InputTime'
import { SelectAPI } from '../../components/BuilderForm/components/Select/Select'
import { AddServiceS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useT } from '../../utils/i18n.util'

export const ServicePage = () => {
	const t = useT()
	return <Table tableName="services" modalTitle={t('createService')} Form={Form} />
}

const Form = () => {
	const [isLoading, setIsLoading] = useState(false)
	const f = useForm(AddServiceS)
	const t = useT()
	return (
		<form
			onSubmit={f.handleSubmit(async (formData) => {
				setIsLoading(true)
				const data = await API_POST_Service(formData)
				if (data) {
					f.reset()
					toastSuccess('Service created successfully')
				}
				setIsLoading(false)
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			<InputText id="name" form={f} placeholder={t('t.name')} />
			<SelectAPI id="categoryPid" form={f} placeholder={t('t.categories')} option="categories" />
			<InputTime id="time" form={f} placeholder={t('t.time')} />
			<Button title={t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

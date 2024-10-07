import { useState } from 'react'

import { useForm } from '@mariuzm/form'

import { API_POST_Category } from '../../apis/entities/categories.api.entity'
import { InputText } from '../../components/BuilderForm/components/InputText'
import { SelectAPIV2 } from '../../components/BuilderForm/components/Select/Select'
import { AddCategoryS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useT } from '../../utils/i18n.util'

export const CategoriesPage = () => {
	const t = useT()
	return <Table tableName="categories" modalTitle={t('createCategory')} Form={Form} />
}

const Form = () => {
	const form = useForm(AddCategoryS)
	const [isLoading, setIsLoading] = useState(false)
	const t = useT()
	return (
		<form
			onSubmit={form.handleSubmit(async (formData) => {
				setIsLoading(true)
				await API_POST_Category(formData)
				setIsLoading(false)
				form.reset()
				toastSuccess('Category created successfully')
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			<SelectAPIV2 id="categoryGroup" form={form} placeholder={t('categoryGroup')} />
			<InputText id="name" form={form} placeholder={t('name')} />
			<Button title={t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

import { useEffect, useState } from 'react'

import { useForm } from '@mariuzm/form'

import { API_PATCH_Category, API_POST_Category } from '../../apis/entities/categories.api.entity'
import { InputText } from '../../components/BuilderForm/components/InputText'
import { SelectAPIV2 } from '../../components/BuilderForm/components/Select/Select'
import { AddCategoryS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useT } from '../../utils/i18n.util'
import type { CategorieT } from '../../apis/types/entities.api.type'

export const CategoriesPage = () => {
	const t = useT()
	return <Table
		tableName="categories"
		modalTitle={t('createCategory')}
		modalTitleEdit={t('editCategory')}
		Form={Form}
		isEditable
	/>
}

const Form = ({ item }: { item?: CategorieT }) => {
	const f = useForm(AddCategoryS)
	const [isLoading, setIsLoading] = useState(false)
	const t = useT()

	useEffect(() => {
		if (item) {
			console.log('itemas', item)
			f.setValue('categoryGroup', item.categoryGroupPid);
			f.setValue('name', item.name);
			return
		} else {
			f.reset();
		}
	}, [f, item]);

	return (
		<form
			onSubmit={f.handleSubmit(async (formData) => {
				setIsLoading(true)
				const res = item
					? await API_PATCH_Category(formData, item.pid)
					: API_POST_Category(formData)
				if (res) {
					!item && f.reset()
					toastSuccess(!item ? 'Category created' : 'Category updated')
				}
				setIsLoading(false)
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			<SelectAPIV2 id="categoryGroup" form={f} placeholder={t('t.serviceGroup')} />
			<InputText id="name" form={f} placeholder={t('name')} />
			<Button title={item ? t('update') : t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

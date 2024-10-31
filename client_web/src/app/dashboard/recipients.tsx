import { useEffect, useState } from 'react'
import { useForm, useWatch } from '@mariuzm/form'

import { API_PATCH_Recipient, API_POST_Recipient } from '../../apis/entities/recipients.api.entity'
import type { RecipientT } from '../../apis/types/entities.api.type'
import { RecipientApprovByE } from '../../apis/types/entities.api.type'
import { InputPrice } from '../../components/BuilderForm/components/InputPrice'
import { InputText } from '../../components/BuilderForm/components/InputText'
import {
	MultiSelect,
	Select,
	SelectAPI,
} from '../../components/BuilderForm/components/Select/Select'
import { AddRecipientS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useStateUser } from '../../states/user.state'
import { useT } from '../../utils/i18n.util'

export const RecipientsPage = () => {
	const t = useT()
	return (
		<Table
			tableName="recipients"
			modalTitle={t('createRecipient')}
			modalTitleEdit={t('editRecipient')}
			Form={Form}
			isEditable
		/>
	)
}

const Form = ({ item }: { item?: RecipientT }) => {
	const f = useForm(AddRecipientS)
	const t = useT()
	const [isLoading, setIsLoading] = useState(false)
	const isAb = useWatch({ name: 'approveBy', control: f.control })
	const user = useStateUser((s) => s.user)
	const isProvider = !!(user && user.role === 'provider')

	useEffect(() => {
		if (item) {
			f.setValue('providerPid', item.createBy)
			f.setValue('firstName', item.firstName)
			f.setValue('lastName', item.lastName)
			f.setValue('address.adddress_line', item.address?.adddressLine || '')
			f.setValue('address.town', item.address?.town || '')
			f.setValue('address.postCode', item.address?.postCode || '')
			f.setValue('address.country', item.address?.country || '')
			f.setValue('phone', item.phone)
			f.setValue('notes', item?.notes || '')
			f.setValue('serviceGroups', item.serviceGroups)
			f.setValue('hourlyRate', item.hourlyRate)
			f.setValue('approveBy', item.approveBy as RecipientApprovByE)
			item.email && f.setValue('email', item.email)
			return
		} else {
			f.reset()
		}
		if (user && user.role === 'provider') {
			f.setValue('providerPid', user.pid)
		}
		f.setValue('address.country', 'Lithuania')
		return () => {
			f.reset()
		}
	}, [f, item, user])

	if (!user) return null

	return (
		<form
			onSubmit={f.handleSubmit(async (form) => {
				setIsLoading(true)
				const res = item
					? await API_PATCH_Recipient(form, item.pid)
					: await API_POST_Recipient(form)
				if (res) {
					!item && f.reset()
					toastSuccess('Recipient created')
				}
				setIsLoading(false)
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			{!isProvider && (
				<>
					<SelectAPI id="providerPid" form={f} placeholder={t('t.providers')} option="providers" />
					<InputText id="providerPid" form={f} placeholder={t('t.providers')} isDisabled />
				</>
			)}
			<InputText id="firstName" form={f} placeholder={t('t.firstName')} />
			<InputText id="lastName" form={f} placeholder={t('t.lastName')} />
			<InputText id="address.adddress_line" form={f} placeholder={t('t.addressLine')} />
			<InputText id="address.town" form={f} placeholder={t('t.town')} />
			<InputText id="address.postCode" form={f} placeholder={t('t.postCode')} />
			<InputText id="address.country" form={f} isDisabled placeholder={t('t.country')} />
			<InputText id="phone" form={f} placeholder={t('t.phone')} />
			<InputText id="notes" form={f} placeholder={t('t.notes')} />
			<InputPrice id="hourlyRate" form={f} placeholder={t('t.hourlyRate')} />
			<MultiSelect id="serviceGroups" form={f} placeholder={t('t.serviceGroup')} isLoadData />
			<Select
				id="approveBy"
				form={f}
				placeholder={t('t.visitConfirmationMethod')}
				options={[
					{ value: 'email', label: t('o.email') },
					{ value: 'signature', label: t('o.signature') },
				]}
			/>
			{isAb === RecipientApprovByE.EMAIL && (
				<InputText id="email" form={f} placeholder={t('email')} />
			)}
			<Button title={item ? t('update') : t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

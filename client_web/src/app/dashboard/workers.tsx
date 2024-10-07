import { useForm } from '@mariuzm/form'
import { useEffect, useState } from 'react'

import { API_POST_Worker } from '../../apis/entities/workers.api.entity'
import { InputText } from '../../components/BuilderForm/components/InputText'
import { SelectAPI } from '../../components/BuilderForm/components/Select/Select'
import { AddWorkerS } from '../../components/BuilderForm/schemas/main.schema'
import { Table } from '../../components/BuilderTable/Table'
import { Button } from '../../components/Button'
import { toastSuccess } from '../../components/Toast'
import { useStateUser } from '../../states/user.state'
import { useT } from '../../utils/i18n.util'

export const WorkersPage = () => {
	const t = useT()
	return <Table tableName="workers" modalTitle={t('createWorker')} Form={Form} isDetail />
}

const Form = () => {
	const f = useForm(AddWorkerS)
	const t = useT()
	const [isLoading, setIsLoading] = useState(false)
	const user = useStateUser((s) => s.user)
	const isProvider = !!(user && user.role === 'provider')

	useEffect(() => {
		if (user && user.role === 'provider') {
			f.setValue('providerPid', user.pid)
		}
	}, [f, user])

	if (!user) return null

	return (
		<form
			onSubmit={f.handleSubmit(async (formData) => {
				setIsLoading(true)
				await API_POST_Worker(formData)
				setIsLoading(false)
				f.reset()
				toastSuccess('Worker created successfully')
			})}
			style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
		>
			{!isProvider && (
				<SelectAPI id="providerPid" form={f} placeholder={t('t.providers')} option="providers" />
			)}
			<InputText id="email" form={f} placeholder={t('email')} />
			<InputText id="firstName" form={f} placeholder={t('t.firstName')} />
			<InputText id="lastName" form={f} placeholder={t('t.lastName')} />
			<InputText id="phone" form={f} placeholder={t('t.phone')} />
			<Button title={t('create')} type="submit" isSubmitting={isLoading} />
		</form>
	)
}

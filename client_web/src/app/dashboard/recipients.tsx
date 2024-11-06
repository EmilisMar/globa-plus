import { useEffect, useState } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
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
import { toastErr, toastSuccess } from '../../components/Toast'
import { useStateUser } from '../../states/user.state'
import { useT } from '../../utils/i18n.util'
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_PLACES_COUNTRIES } from '../../config/googleMapsConfig'

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
	const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
	const [isPlaceSelected, setIsPlaceSelected] = useState<boolean>(false)
	const isAb = useWatch({ name: 'approveBy', control: f.control })
	const user = useStateUser((s) => s.user)
	const isProvider = !!(user && user.role === 'provider')

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
		libraries: GOOGLE_MAPS_LIBRARIES,
	})

	if (loadError) {
		toastErr(`${"Error loading Google Maps API: " + loadError}`)
	}

	const handlePlaceSelect = () => {
		if (!autocomplete) return

		const place = autocomplete.getPlace()
		if (!place || !place.address_components) {
			console.error("No address components found for this place")
			return
		}

		const streetName = place.address_components.find(comp => comp.types.includes("route"))?.long_name || ""
		const streetNumber = place.address_components.find(comp => comp.types.includes("street_number"))?.long_name || ""
		const addressLine = `${streetName} ${streetNumber}`.trim()
		const town = place.address_components.find(comp => comp.types.includes("locality"))?.long_name || ""
		const postCode = place.address_components.find(comp => comp.types.includes("postal_code"))?.long_name || ""
		const country = place.address_components.find(comp => comp.types.includes("country"))?.long_name || "Lithuania"
		const fullAddress = `${addressLine}, ${town}, ${postCode}, ${country}`
		const lat = place.geometry?.location?.lat()
		const lng = place.geometry?.location?.lng()
		f.setValue('address.full_address', fullAddress)
		f.setValue('address.adddress_line', addressLine)
		f.setValue('address.town', town)
		f.setValue('address.postCode', postCode)
		f.setValue('address.country', country)
		f.setValue('address.latitude', lat || null)
		f.setValue('address.longitude', lng || null)
		setIsPlaceSelected(true)
		f.clearErrors('address.full_address')
	}

	const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
		autocompleteInstance.setComponentRestrictions(GOOGLE_MAPS_PLACES_COUNTRIES)
		setAutocomplete(autocompleteInstance)
	}

	// Reset autocomplete field if manually changed by user
	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsPlaceSelected(false)
		f.clearErrors('address.full_address')
	}

	useEffect(() => {
		if (item) {
			f.setValue('providerPid', item.createBy)
			f.setValue('firstName', item.firstName)
			f.setValue('lastName', item.lastName)
			f.setValue('address.full_address', item.address?.fullAddress || '')
			f.setValue('address.adddress_line', item.address?.adddressLine || '')
			f.setValue('address.town', item.address?.town || '')
			f.setValue('address.postCode', item.address?.postCode || '')
			f.setValue('address.country', item.address?.country || '')
			f.setValue('address.latitude', item.address?.latitude || null)
			f.setValue('address.longitude', item.address?.longitude || null)
			f.setValue('phone', item.phone)
			f.setValue('notes', item?.notes || '')
			f.setValue('serviceGroups', item.serviceGroups)
			f.setValue('hourlyRate', item.hourlyRate)
			f.setValue('approveBy', item.approveBy as RecipientApprovByE)
			item.email && f.setValue('email', item.email)

			f.clearErrors('address.full_address')
			setIsPlaceSelected(true)
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
				if ((!isPlaceSelected)) {
					f.setError('address.full_address', {
						type: 'required',
						message: t('t.selectCorrectAddress'),
					})
					return
				}
				setIsLoading(true)
				const res = item
					? await API_PATCH_Recipient(form, item.pid)
					: await API_POST_Recipient(form)
				if (res) {
					!item && f.reset()
					toastSuccess('Recipient created')
					setIsPlaceSelected(false)
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
			{isLoaded && (
				<Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
					<InputText
						id="address.full_address"
						form={f}
						placeholder={t('t.address')}
						onChange={handleAddressChange}
					/>
				</Autocomplete>
			)}
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

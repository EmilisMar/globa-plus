import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Select as MSelect } from '@mantine/core'
import { Controller, type Form } from '@mariuzm/form'

import {
	API_GET_Entity_Options,
	API_GET_Options,
	API_GET_OptionsV2,
} from '../../../../apis/options.api'
import type { TableOptionsT } from '../../../../apis/types/options.api.type'
import { Color } from '../../../../styles/base.style'
import { Spinner } from '../../../Loader'
import { FormError } from '../components/FormError'

import css from './Select.module.css'

type SelectOptionT = { value: string; label: string }

export const Select = <T extends object>({
	id,
	form,
	placeholder,
	options,
	isDisabled,
}: Form<T> & {
	placeholder?: string
	options: SelectOptionT[]
	isDisabled?: boolean
}) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<MSelect
							classNames={{ input: css.select }}
							value={value || ''}
							onChange={onChange}
							disabled={isDisabled}
							placeholder={placeholder}
							data={options}
							styles={{
								input: { color: Color.Text, backgroundColor: Color.GreyLight },
								options: { color: Color.Text },
							}}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

export const SelectAPI = <T extends object>({
	id,
	form,
	placeholder,
	option,
	isDisabled,
}: Form<T> & {
	placeholder?: string
	option: TableOptionsT
	isDisabled?: boolean
}) => {
	const [isApiLoading, setIsApiLoading] = useState(false)
	const [data, setData] = useState<SelectOptionT[]>([])
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<MSelect
							classNames={{ input: css.select }}
							value={value || ''}
							onChange={onChange}
							onClick={async () => {
								setIsApiLoading(true)
								setData(await API_GET_Options(option))
								setIsApiLoading(false)
							}}
							disabled={isDisabled}
							placeholder={placeholder}
							data={data}
							rightSection={isApiLoading && <Spinner />}
							styles={{
								input: { color: Color.Text, backgroundColor: Color.GreyLight },
								options: { color: Color.Text },
							}}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

export const SelectAPIV2 = <T extends object>({
	id,
	form,
	placeholder,
	isDisabled,
}: Form<T> & {
	placeholder?: string
	isDisabled?: boolean
}) => {
	const [isApiLoading, setIsApiLoading] = useState(false)
	const [data, setData] = useState<SelectOptionT[]>([])
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<MSelect
							classNames={{ input: css.select }}
							value={value || ''}
							onChange={onChange}
							onClick={async () => {
								setIsApiLoading(true)
								setData(await API_GET_OptionsV2('categories_groups'))
								setIsApiLoading(false)
							}}
							disabled={isDisabled}
							placeholder={placeholder}
							data={data}
							rightSection={isApiLoading && <Spinner />}
							styles={{
								input: { color: Color.Text, backgroundColor: Color.GreyLight },
								options: { color: Color.Text },
							}}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

export const SelectBaseAPI = ({ initVal, entity }: { initVal: string; entity: 'workers' }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [data, setData] = useState<SelectOptionT[]>([])
	const [value, setValue] = useState<string | null>(initVal)
	const nav = useNavigate()
	const path = useLocation().pathname.split('/')

	useEffect(() => {
		const main = async () => {
			setData(await API_GET_Entity_Options(entity))
			setIsLoading(false)
		}
		main()
	}, [entity])

	const onChange = async (pid: string | null) => {
		if (!pid) return
		setValue(pid)
		nav(`/${path[1]}/${path[2]}/${entity}/${pid}`)
	}

	return (
		<MSelect
			classNames={{ dropdown: 'text-[--PrimaryDark]' }}
			value={value}
			onChange={onChange}
			data={data}
			rightSection={isLoading && <Spinner />}
		/>
	)
}

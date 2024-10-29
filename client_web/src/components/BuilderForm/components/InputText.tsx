import { TextInput } from '@mantine/core'
import { Controller, type Form } from '@mariuzm/form'
import { textFormat } from '@mariuzm/utils'

import { Color } from '../../../styles/base.style'

import { FormError } from './components/FormError'

export const InputText = <T extends object>({
	id,
	form,
	isDisabled,
	placeholder,
	onChange: customOnChange,
}: Form<T> & {
	isDisabled?: boolean
	placeholder?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				// Wrap the default onChange to handle custom logic if provided
				const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
					onChange(e)
					if (customOnChange) customOnChange(e)
				}
				
				return (
					<div>
						<TextInput
							value={value || ''}
							onChange={handleChange}
							placeholder={placeholder || textFormat(id)}
							variant="filled"
							disabled={isDisabled}
							styles={{ input: { color: Color.Text, backgroundColor: Color.GreyLight } }}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

import { DateTimePicker as MDateTimePicker } from '@mantine/dates'
import { Controller, type Form } from '@mariuzm/form'
import { textFormat } from '@mariuzm/utils'

import { Color } from '../../../styles/base.style'

import { FormError } from './components/FormError'

export const DateTimePicker = <T extends object>({
	id,
	form,
	placeholder,
}: Form<T> & {
	placeholder?: string
}) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<MDateTimePicker
							value={value}
							onChange={onChange}
							placeholder={placeholder || textFormat(id)}
							variant="filled"
							styles={{ input: { color: Color.Text, backgroundColor: Color.GreyLight } }}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

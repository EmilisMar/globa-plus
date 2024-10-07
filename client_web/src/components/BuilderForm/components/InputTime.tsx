import { TimeInput } from '@mantine/dates'
import { Controller, type Form } from '@mariuzm/form'
import { textFormat } from '@mariuzm/utils'

import { Color } from '../../../styles/base.style'

import { FormError } from './components/FormError'

export const InputTime = <T extends object>({
	id,
	form,
	isDisabled,
	placeholder,
}: Form<T> & {
	isDisabled?: boolean
	placeholder?: string
}) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<TimeInput
							value={value || ''}
							onChange={onChange}
							placeholder={placeholder || textFormat(id)}
							variant="filled"
							disabled={isDisabled}
							styles={{ input: { color: Color.Primary, backgroundColor: Color.GreyLight } }}
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

import { Checkbox as MCheckbox } from '@mantine/core'
import { Controller, type Form } from '@mariuzm/form'

import { Color } from '../../../styles/base.style'

import { FormError } from './components/FormError'

export const Checkbox = <T extends object>({
	id,
	form,
	label,
}: Form<T> & {
	label: string
}) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div>
						<MCheckbox
							label={label}
							checked={value}
							onChange={onChange}
							color={Color.Primary}
							size="md"
						/>
						<FormError message={error?.message} />
					</div>
				)
			}}
		/>
	)
}

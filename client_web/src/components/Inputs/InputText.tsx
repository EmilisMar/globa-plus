import { TextInput as MTextInput } from '@mantine/core'
import { textFormat } from '@mariuzm/utils'

import { Color } from '../../styles/base.style'

export const InputText = ({
	id,
	placeholder,
	form,
	type = 'text',
}: {
	id: string
	placeholder?: string
	form: any
	type?: 'email' | 'password' | 'text'
}) => {
	return (
		<MTextInput
			{...form.getInputProps(id)}
			placeholder={placeholder || textFormat(id)}
			variant="filled"
			type={type}
			{...(type === 'email' && { autoComplete: 'email' })}
			styles={{ input: { color: Color.PrimaryDark } }}
		/>
	)
}

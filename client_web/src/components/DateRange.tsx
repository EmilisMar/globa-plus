import { DatePickerInput } from '@mantine/dates'

export const DateRange = ({
	placeholder,
	onChange,
}: {
	placeholder?: string
	onChange: (value: [Date | null, Date | null]) => void
}) => {
	return (
		<DatePickerInput
			className="w-[300px]"
			onChange={onChange}
			placeholder={placeholder}
			type="range"
		/>
	)
}

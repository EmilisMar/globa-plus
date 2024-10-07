import { Button, Popover } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { MonthPicker as MMonthPicker } from '@mantine/dates'
import { useState } from 'react'

import { Color } from '../../../styles/base.style'
import { CalendarIcon } from '../../Icons'

import css from './MonthPicker.module.css'

type Date = {
	value: DateValue
	setValue: (value: DateValue) => void
}

export const MonthPickerPopover = ({ value, setValue }: Date) => {
	const [opened, setOpened] = useState(false)
	return (
		<Popover opened={opened} withArrow shadow="md">
			<Popover.Target>
				<Button onClick={() => setOpened((o) => !o)} variant="light" color={Color.Primary}>
					<CalendarIcon />
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<MonthPicker value={value} setValue={setValue} />
			</Popover.Dropdown>
		</Popover>
	)
}

const MonthPicker = ({ value, setValue }: Date) => {
	return (
		<MMonthPicker
			classNames={{ monthsListRow: css.monthsListRow }}
			value={value}
			onChange={setValue}
			color={Color.Primary}
		/>
	)
}

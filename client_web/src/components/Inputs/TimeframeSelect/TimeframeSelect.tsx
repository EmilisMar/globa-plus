import { Select } from '@mantine/core'

import { t } from './../../../utils/i18n.util'

type TimeframeSelectProps = {
	value: string | null
	onChange: (value: string | null) => void
}

export const TimeframeSelect = ({ value, onChange }: TimeframeSelectProps) => {
	return (
		<Select
			placeholder={t('selectTimeframe')}
			value={value}
			onChange={onChange}
			data={[
				{ value: 'today', label: t('timeframe.today') },
				{ value: 'week', label: t('timeframe.thisWeek') },
				{ value: 'month', label: t('timeframe.thisMonth') },
				{ value: 'all', label: t('showAll') },
			]}
		/>
	)
}

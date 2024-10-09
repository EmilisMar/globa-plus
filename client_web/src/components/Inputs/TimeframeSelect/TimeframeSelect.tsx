import { Select } from '@mantine/core';
import { t } from './../../../utils/i18n.util';

type TimeframeSelectProps = {
    value: string | null; // The currently selected timeframe
    onChange: (value: string | null) => void; // Callback to handle selection changes
};

export const TimeframeSelect = ({ value, onChange}: TimeframeSelectProps) => {
    return (
        <Select
            label=""
            placeholder={t('selectTimeframe')}
            value={value}
            onChange={onChange}
            data={[
                { value: 'today', label: t('timeframe.today') },
                { value: 'week', label: t('timeframe.thisWeek') },
                { value: 'month', label: t('timeframe.thisMonth') },
                { value: 'all', label: t('showAll') }
            ]}
        />
    );
};

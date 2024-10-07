import React from 'react';
import { getL } from './../utils/i18n.util'
import { PeriodOption } from '../enums/periods.enums';

interface PeriodFilterSelectProps {
    value?: PeriodOption;
    onChange: (value: PeriodOption) => void;
}

const PeriodFilterSelect: React.FC<PeriodFilterSelectProps> = ({ value = PeriodOption.Today, onChange }) => {
    const options = Object.values(PeriodOption);

    const handleChange = ((e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value as PeriodOption);
    });

    const getOptionText = (period: PeriodOption) => {
        switch (period) {
            case PeriodOption.Today: return getL() === 'lt' ? "Šiandien" : PeriodOption.Today;
            case PeriodOption.ThisWeek: return getL() === 'lt' ? "Šią savaitę" : PeriodOption.ThisWeek;
            default: return getL() === 'lt' ? "Visi" : PeriodOption.All;
        }
    }

    return (
        <select 
            value={value} 
            onChange={handleChange} 
            style={{ border: "1px solid rgb(56, 182, 255)", borderRadius: 5, padding: 5 }}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {getOptionText(option)}
                </option>
            ))}
        </select>
    );
};

export default PeriodFilterSelect;

import { PeriodOption } from "../../enums/periods.enums";

export const getDateRangeByPeriod = (selectedPeriod: PeriodOption) => {
    const now = new Date();
    console.log(selectedPeriod)
    switch (selectedPeriod) {
        case PeriodOption.Today: {
            const dateFrom = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
            const dateTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
            return { dateFrom, dateTo };
        }
        case PeriodOption.ThisWeek: {
            const dayOfWeek = now.getUTCDay();
            const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset, 0, 0, 0));
            const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset + 6, 23, 59, 59, 999));
            return { dateFrom: start, dateTo: end };
        }
        default:
            return { dateFrom: null, dateTo: null };
    }
};
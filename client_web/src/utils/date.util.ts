/* --- Begin client_web\src\utils\date.util.ts --- */
import { DateValue } from '@mantine/dates';
import moment from 'moment';

/**
 * Get the last moment of the given date's month as a regular Date object.
 * 
 * @param date - The date for which to find the end of the month.
 * @returns A Date object set to the last moment of the month.
 */
export const endOfMonth = (date: DateValue): Date => {
    return moment(date).endOf('month').toDate();
};

export const startOfMonth = (date: DateValue): Date => {
    return moment(date).startOf('month').toDate();
};

/**
 * Get the last moment of the given date's day as a regular Date object.
 * 
 * @param date - The date for which to find the end of the day.
 * @returns A Date object set to the last moment of the day.
 */
export const endOfDay = (date: DateValue): Date => {
    return moment(date).endOf('day').toDate();
};

/**
 * Get the start of the given date's day as a regular Date object.
 * 
 * @param date - The date for which to find the start of the day.
 * @returns A Date object set to the start of the day.
 */
export const startOfDay = (date: DateValue): Date => {
    return moment(date).startOf('day').toDate();
};

/**
 * Get the start of the current week as a regular Date object.
 * 
 * @param date - The date for which to find the start of the week (defaults to now if not provided).
 * @returns A Date object set to the start of the week.
 */
export const startOfWeek = (date: DateValue = new Date()): Date => {
    return moment(date).startOf('week').toDate();
};

/**
 * Get the end of the current week as a regular Date object.
 * 
 * @param date - The date for which to find the end of the week (defaults to now if not provided).
 * @returns A Date object set to the end of the week.
 */
export const endOfWeek = (date: DateValue = new Date()): Date => {
    return moment(date).endOf('week').toDate();
};

/* --- End client_web\src\utils\date.util.ts --- */

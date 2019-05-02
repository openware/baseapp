import * as moment from 'moment-timezone';

let timezone = '';
export const getTimezone = () => timezone.length > 0 ? timezone : moment.tz.guess();
export const setTimezone = (tz: string) => timezone = tz;

export const stdTimezoneOffset = (date: Date) => {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

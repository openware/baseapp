import * as moment from 'moment-timezone';

let timezone = '';
export const getTimezone = () => timezone.length > 0 ? timezone : moment.tz.guess();
export const setTimezone = (tz: string) => timezone = tz;

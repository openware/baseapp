import moment from 'moment-timezone';
import { getTimezone } from '../../../helpers';

const getFormattedExpirationDate = (date, timezone = getTimezone()) => {
    const isUnix = typeof date === 'number';
    const momentObj = isUnix ? moment.unix(date) : moment(date);

    return momentObj.tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
};

const formatDateValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
};

export const getCountdownDate = (expirationDate, plusTime?) => {
    const countdownDate = new Date(getFormattedExpirationDate(expirationDate)).getTime();
    const timeNow = new Date().getTime();
    let timeToExpire = countdownDate - timeNow;
    if (plusTime === '5m') {
        timeToExpire = countdownDate - timeNow + (5 * 60 * 1000);
    }
    const hours = Math.floor(timeToExpire / (1000 * 60 * 60));
    const minutes = Math.floor((timeToExpire % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeToExpire % (1000 * 60)) / 1000);

    if (timeToExpire < 0) {
        return '00:00:00';
    }

    return `${formatDateValue(hours)}:${formatDateValue(minutes)}:${formatDateValue(seconds)}`;
};

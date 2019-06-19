import { Timezone } from '../../charting_library/datafeed-api';

/*
** TimeZones for Daylight Saving Time (Summer time)
*/
const zonesDST: { [key: string]: Timezone } = {
    '-780': 'Pacific/Fakaofo',
    '-765': 'Pacific/Chatham',
    '-720': 'Pacific/Auckland',
    '-600': 'Australia/ACT',
    '-570': 'Australia/Adelaide',
    '-540': 'Asia/Tokyo',
    '-480': 'Asia/Shanghai',
    '-420': 'Asia/Bangkok',
    '-360': 'Asia/Almaty',
    '-345': 'Asia/Kathmandu',
    '-330': 'Asia/Kolkata',
    '-240': 'Asia/Dubai',
    '-270': 'Asia/Tehran',
    '-180': 'Europe/Moscow',
    '-120': 'Europe/Paris',
    60: 'Europe/London',
    180: 'America/Sao_Paulo',
    240: 'America/New_York',
    360: 'America/El_Salvador',
    420: 'America/Los_Angeles',
    600: 'Pacific/Honolulu',
};

/*
** TimeZones for Standart Time (Winter time)
*/
const zonesSTD: { [key: string]: Timezone } = {
    '-825': 'Pacific/Chatham',
    '-780': 'Pacific/Auckland',
    '-660': 'Australia/Brisbane',
    '-630': 'Australia/Adelaide',
    '-540': 'Asia/Tokyo',
    '-480': 'Asia/Shanghai',
    '-420': 'Asia/Bangkok',
    '-360': 'Asia/Almaty',
    '-345': 'Asia/Kathmandu',
    '-330': 'Asia/Kolkata',
    '-240': 'Asia/Dubai',
    '-210': 'Asia/Tehran',
    '-180': 'Europe/Moscow',
    '-120': 'Africa/Cairo',
    '-60': 'Europe/Paris',
    0: 'Europe/London',
    120: 'America/Argentina/Buenos_Aires',
    240: 'America/Caracas',
    300: 'America/Bogota',
    360: 'America/El_Salvador',
    480: 'America/Los_Angeles',
    600: 'Pacific/Honolulu',
};

export const getTradingChartTimezone = (offset: number | string, period: 'DST' | 'STD'): Timezone => {
    const zone: Timezone = period === 'DST' ? zonesDST[offset] : zonesSTD[offset];
    return zone ? zone : 'Etc/UTC';
};

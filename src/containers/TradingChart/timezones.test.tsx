import { getTradingChartTimezone } from './timezones';

describe('getTradingChartTimezone', () => {
    it('returns time zone in olsondb format', () => {
        expect(getTradingChartTimezone(60, 'DST')).toEqual('Europe/London');
        expect(getTradingChartTimezone(-480, 'DST')).toEqual('Asia/Shanghai');
        expect(getTradingChartTimezone(-180, 'DST')).toEqual('Europe/Moscow');
        expect(getTradingChartTimezone(-120, 'STD')).toEqual('Africa/Cairo');
        expect(getTradingChartTimezone('-120', 'STD')).toEqual('Africa/Cairo');
    });

    it('default to UTC', () => {
        expect(getTradingChartTimezone(2000, 'DST')).toEqual('Etc/UTC');
    });
});

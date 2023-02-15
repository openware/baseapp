import { tvDefaultCandles } from 'src/api/config';

export const getStartTimestampPeriod = (tsTo: number | string, period: number | string): number => {
    const periodSeconds = period === '1D' ? 60 * 60 * 24 : period === 'D' ? 60 * 60 * 24 * 3 : +period * 60;

    const tsFrom = +tsTo - +periodSeconds * tvDefaultCandles();
    return tsFrom;
};

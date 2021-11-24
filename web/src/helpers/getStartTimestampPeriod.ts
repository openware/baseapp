import { tvDefaultCandles } from "src/api/config";

export const getStartTimestampPeriod = (tsTo: number | string, period: number | string): number => {
    const periodMinutes = period === '1D' ? (60 * 24)
        : period === 'D' ? (60 * 24 * 3)
        : period;

        const tsFrom = +tsTo - (+periodMinutes * tvDefaultCandles())
    return tsFrom;
}

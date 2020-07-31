export const getTimestampPeriod = (ts: number | string, period: number | string): number => +ts - +ts % ((+period || 1) * 60);

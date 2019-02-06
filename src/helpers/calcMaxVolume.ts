import { accumulateVolume } from './accumulateVolume';

export const calcMaxVolume = (bids: string[][], asks: string[][]) => {
    return Math.max(...accumulateVolume(bids), ...accumulateVolume(asks));
};

import { MakerType } from './user/history';

const makerTypeMap = {
    ask: 'sell',
    bid: 'buy',
};

export const kindToMakerType = (kind: string): MakerType => makerTypeMap[kind];

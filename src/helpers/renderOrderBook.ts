import { Decimal } from '@openware/components';
import { Market } from '../modules';
import { accumulateVolume } from './accumulateVolume';

export const renderOrderBook = (array: string[][], side: string, currentMarket?: Market) => {
    const total = accumulateVolume(array);
    const priceFixed = currentMarket ? currentMarket.bid_precision : 0;
    const amountFixed = currentMarket ? currentMarket.ask_precision : 0;
    return (array.length > 0) ? array.map((item, i) => {
        const [price, volume] = item;
        return side === 'asks' ?
            [Decimal.format(Number(price), priceFixed), Decimal.format(Number(volume), amountFixed), Decimal.format(Number(total[i]), amountFixed)] :
            [Decimal.format(Number(total[i]), amountFixed), Decimal.format(Number(volume), amountFixed), Decimal.format(Number(price), priceFixed)];
    }) : [['There is no data to show...']];
};

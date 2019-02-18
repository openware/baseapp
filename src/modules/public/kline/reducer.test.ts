import { klinePush } from './actions';
import { klineReducer, KlineState } from './reducer';

describe('kline reducer', () => {
    const expectedState: KlineState = {
        last: {
            time: 1549730700000,
            close: 7.606824173956803,
            open: 7.4794122620116195,
            high: 7.690157507290136,
            low: 7.396078928678286,
            volume: 36.98530655029049,
        },
        marketId: 'ethusd',
        period: '15m',
        loading: false,
    };

    it('supports kline push action with string kline', () => {
        const kline = ['1549730700', '7.4794122620116195', '7.690157507290136', '7.396078928678286', '7.606824173956803', '36.98530655029049'];
        const payload = {
            marketId: 'ethusd',
            period: '15m',
            kline,
        };

        expect(klineReducer(undefined, klinePush(payload))).toEqual(expectedState);
    });

    it('supports kline push action with number kline', () => {
        const kline = [1549730700, 7.4794122620116195, 7.690157507290136, 7.396078928678286, 7.606824173956803, 36.98530655029049];
        const payload = {
            marketId: 'ethusd',
            period: '15m',
            kline,
        };
        expect(klineReducer(undefined, klinePush(payload))).toEqual(expectedState);
    });
});

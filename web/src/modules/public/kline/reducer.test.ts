import * as actions from './actions';
import { initialKlineState, klineReducer } from './reducer';

describe('kline reducer', () => {
    it('supports kline push action with string kline', () => {
        const kline = ['1549730700', '7.4794122620116195', '7.690157507290136', '7.396078928678286', '7.606824173956803', '36.98530655029049'];
        const payload = {
            marketId: 'ethusd',
            period: '15m',
            kline,
        };

        const expectedState = {
            ...initialKlineState,
            marketId: 'ethusd',
            period: '15m',
            last: {
                time: 1549730700000,
                close: 7.606824173956803,
                open: 7.4794122620116195,
                high: 7.690157507290136,
                low: 7.396078928678286,
                volume: 36.98530655029049,
            },
        };

        expect(klineReducer(undefined, actions.klinePush(payload))).toEqual(expectedState);
    });

    it('supports kline push action with number kline', () => {
        const kline = [1549730700, 7.4794122620116195, 7.690157507290136, 7.396078928678286, 7.606824173956803, 36.98530655029049];
        const payload = {
            marketId: 'ethusd',
            period: '15m',
            kline,
        };

        const expectedState = {
            ...initialKlineState,
            marketId: 'ethusd',
            period: '15m',
            last: {
                time: 1549730700000,
                close: 7.606824173956803,
                open: 7.4794122620116195,
                high: 7.690157507290136,
                low: 7.396078928678286,
                volume: 36.98530655029049,
            },
        };

        expect(klineReducer(undefined, actions.klinePush(payload))).toEqual(expectedState);
    });

    it('supports kline fetch action', () => {
        const payload = {
            market: '',
            resolution: 0,
            from: '',
            to: '',
        };
        const expectedState = {
            ...initialKlineState,
            loading: true,
        };
        expect(klineReducer(undefined, actions.klineFetch(payload))).toEqual(expectedState);
    });

    it('supports kline data action', () => {
        const payload = [{}];
        const expectedState = {
            ...initialKlineState,
            loading: false,
            data: payload,
        };
        expect(klineReducer(undefined, actions.klineData(payload))).toEqual(expectedState);
    });

    it('supports klineUpdateTimeRange action', () => {
        const payload = {
            from: 12345,
            to: 123456,
        };
        const expectedState = {
            ...initialKlineState,
            range: payload,
        };
        expect(klineReducer(undefined, actions.klineUpdateTimeRange(payload))).toEqual(expectedState);
    });
});

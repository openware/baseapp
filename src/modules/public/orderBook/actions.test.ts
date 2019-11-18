import { Market } from '../markets';
import * as actions from './actions';
import {
    DEPTH_DATA,
    DEPTH_DATA_INCREMENT,
    DEPTH_DATA_SNAPSHOT,
    DEPTH_ERROR,
    DEPTH_FETCH,
    ORDER_BOOK_DATA,
    ORDER_BOOK_ERROR,
    ORDER_BOOK_FETCH,
} from './constants';
import { OrderBookState } from './types';

describe('Orderbook/MarketDepth actions', () => {
    const fakeMarket: Market = {
        id: 'btczar',
        name: 'BTC/ZAR',
        base_unit: 'btc',
        quote_unit: 'zar',
        min_price: '0.0',
        max_price: '0.0',
        min_amount: '0.0',
        amount_precision: 4,
        price_precision: 4,
    };

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check orderbook action creator', () => {
        const expectedAction = { type: ORDER_BOOK_FETCH, payload: fakeMarket };
        expect(actions.orderBookFetch(fakeMarket)).toEqual(expectedAction);
    });

    it('should check depth action creator', () => {
        const expectedAction = { type: DEPTH_FETCH, payload: fakeMarket };
        expect(actions.depthFetch(fakeMarket)).toEqual(expectedAction);
    });

    it('should check orderbookError action creator', () => {
        const expectedAction = { type: ORDER_BOOK_ERROR, error: fakeError };
        expect(actions.orderBookError(fakeError)).toEqual(expectedAction);
    });

    it('should check depthError action creator', () => {
        const expectedAction = { type: DEPTH_ERROR, error: fakeError };
        expect(actions.depthError(fakeError)).toEqual(expectedAction);
    });

    it('should check orderbookData action creator', () => {
        const fakeOrderBook: OrderBookState = {
            asks: [
                {
                    id: 202440,
                    side: 'sell',
                    price: '0.99',
                    avg_price: '0.99',
                    state: 'wait',
                    market: 'btczar',
                    created_at: '2018-11-21T15:19:48+01:00',
                    volume: '0.12',
                    remaining_volume: '0.09',
                    executed_volume: '0.03',
                    trades_count: 1,
                    ord_type: 'limit',
                },
            ],
            bids: [
                {
                    id: 203599,
                    side: 'buy',
                    price: '0.01',
                    avg_price: '0.01',
                    state: 'wait',
                    market: 'btczar',
                    created_at: '2018-12-14T14:20:12+01:00',
                    volume: '0.1',
                    remaining_volume: '0.041',
                    executed_volume: '0.059',
                    trades_count: 1,
                    ord_type: 'limit',
                },
            ],
            loading: false,
        };
        const expectedAction = { type: ORDER_BOOK_DATA, payload: fakeOrderBook };
        expect(actions.orderBookData(fakeOrderBook)).toEqual(expectedAction);
    });

    it('should check depthData action creator', () => {
        const fakeDepth = {
            asks: [['0.99', '1'], ['0.98', '20']],
            bids: [['0.50', '0.041'], ['0.49', '0.5'], ['0.26', '25']],
            loading: false,
        };
        const expectedAction = { type: DEPTH_DATA, payload: fakeDepth };
        expect(actions.depthData(fakeDepth)).toEqual(expectedAction);
    });

    it('should check depthDataSnapshot action creator', () => {
        const fakeDepth = {
            asks: [['0.99', '1'], ['0.98', '20']],
            bids: [['0.50', '0.041'], ['0.49', '0.5'], ['0.26', '25']],
        };
        const expectedAction = { type: DEPTH_DATA_SNAPSHOT, payload: fakeDepth };
        expect(actions.depthDataSnapshot(fakeDepth)).toEqual(expectedAction);
    });

    it('should check depthDataIncrement action creator', () => {
        const fakeOrder = {
            asks: ['0.99', '0.5'],
            bids: null,
        };

        const fakeDepth = {
            asks: ['0.99', '0.5'],
            bids: null,
        };

        const expectedAction = { type: DEPTH_DATA_INCREMENT, payload: fakeDepth };
        expect(actions.depthDataIncrement(fakeOrder)).toEqual(expectedAction);
    });
});

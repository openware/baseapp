import * as actions from './actions';
import { TEST_ORDERS_HISTORY_STATE } from './constants';
import { initialOrdersHistoryState, ordersHistoryReducer } from './reducer';

describe('Orders History reducer', () => {
    it('should return initial state', () => {
        expect(ordersHistoryReducer(undefined, { type: TEST_ORDERS_HISTORY_STATE })).toEqual(initialOrdersHistoryState);
    });

    it('should handle USER_ORDERS_HISTORY_FETCH', () => {
        const expectedState = { ...initialOrdersHistoryState, fetching: true };
        const payload = { pageIndex: 0, type: 'all', limit: 25 };
        expect(ordersHistoryReducer(initialOrdersHistoryState, actions.userOrdersHistoryFetch(payload))).toEqual(expectedState);
    });

    it('should handle USER_ORDERS_HISTORY_DATA', () => {
        const initialState = { ...initialOrdersHistoryState, fetching: true };
        const payload: actions.UserOrdersHistoryDataPayload = {
            list: [
                {
                    id: 162,
                    side: 'buy',
                    price: 0.3,
                    state:'wait',
                    created_at: '2018-11-29T16:54:46+01:00',
                    volume: '123.1234',
                    remaining_volume: '123.1234',
                    executed_volume: '0.0',
                    trades_count: 0,
                },
                {
                    id: 16,
                    side: 'sell',
                    price: 0.3,
                    state: 'wait',
                    created_at: '2018-11-20T10:24:48+01:00',
                    volume: '123.1234',
                    remaining_volume: '123.1234',
                    executed_volume: '0.0',
                    trades_count: 0,
                },
            ],
            pageIndex: 1,
            total: 2,
        };
        const expectedState = { ...initialState, ...payload, fetching: false };
        expect(ordersHistoryReducer(initialState, actions.userOrdersHistoryData(payload))).toEqual(expectedState);
    });

    it('should handle USER_ORDERS_HISTORY_ERROR', () => {
        const initialState = { ...initialOrdersHistoryState, fetching: true };
        const expectedState = { ...initialOrdersHistoryState, list: [], total: 0, pageIndex: 0, fetching: false };
        expect(ordersHistoryReducer(initialState, actions.userOrdersHistoryError())).toEqual(expectedState);
    });
});

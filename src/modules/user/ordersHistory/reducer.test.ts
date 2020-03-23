import { OrderAPI, OrderCommon, OrderEvent } from '../../types';
import { convertOrderAPI, convertOrderEvent } from '../openOrders/helpers';
import * as actions from './actions';
import { ORDERS_TEST_HISTORY_STATE } from './constants';
import { insertOrUpdate } from './helpers';
import { initialOrdersHistoryState, ordersHistoryReducer, OrdersHistoryState } from './reducer';

describe('Orders History reducer', () => {
    it('should return initial state', () => {
        expect(ordersHistoryReducer(undefined, { type: ORDERS_TEST_HISTORY_STATE })).toEqual(initialOrdersHistoryState);
    });

    it('should handle USER_ORDERS_HISTORY_FETCH', () => {
        const expectedState = { ...initialOrdersHistoryState, fetching: true };
        const payload = { pageIndex: 0, type: 'all', limit: 25 };
        expect(ordersHistoryReducer(initialOrdersHistoryState, actions.userOrdersHistoryFetch(payload))).toEqual(expectedState);
    });

    it('should handle USER_ORDERS_HISTORY_DATA', () => {
        const initialState = { ...initialOrdersHistoryState, fetching: true };
        const apiList: OrderAPI[] = [
            {
                id: 162,
                side: 'buy',
                price: '0.3',
                state:'wait',
                created_at: '2018-11-29T16:54:46+01:00',
                origin_volume: '123.1234',
                remaining_volume: '123.1234',
                executed_volume: '0.0',
                market: 'ethbtc',
                ord_type: 'limit',
                avg_price: '0.2',
            },
            {
                id: 16,
                side: 'sell',
                price: '0.3',
                state: 'wait',
                created_at: '2018-11-20T10:24:48+01:00',
                origin_volume: '123.1234',
                remaining_volume: '123.1234',
                executed_volume: '0.0',
                market: 'ethbtc',
                ord_type: 'limit',
                avg_price: '0.2',
            },
        ];
        const payload: actions.UserOrdersHistoryDataPayload = {
            list: apiList.map(convertOrderAPI),
            pageIndex: 1,
        };
        const expectedState = { ...initialState, ...payload, fetching: false };
        expect(ordersHistoryReducer(initialState, actions.userOrdersHistoryData(payload))).toEqual(expectedState);
    });

    it('should handle USER_ORDERS_HISTORY_ERROR', () => {
        const initialState = { ...initialOrdersHistoryState, fetching: true };
        const expectedState = { ...initialOrdersHistoryState, list: [], pageIndex: 0, fetching: false };
        expect(ordersHistoryReducer(initialState, actions.userOrdersHistoryError())).toEqual(expectedState);
    });

    it('should handle ORDERS_CANCEL_ALL_FETCH', () => {
        const expectedState = { ...initialOrdersHistoryState, cancelAllFetching: true };
        const payload = { tab: 'open' };
        expect(ordersHistoryReducer(initialOrdersHistoryState, actions.ordersCancelAllFetch(payload))).toEqual(expectedState);
    });

    it('should handle ORDERS_CANCEL_ALL_DATA', () => {
        const initialState = { ...initialOrdersHistoryState, cancelAllFetching: true };
        const payload = [];
        const expectedState = { ...initialState, ...payload, cancelAllFetching: false };
        expect(ordersHistoryReducer(initialState, actions.ordersCancelAllData(payload))).toEqual(expectedState);
    });

    it('should handle ORDERS_CANCEL_ALL_ERROR', () => {
        const initialState = { ...initialOrdersHistoryState, cancelAllFetching: true };
        const expectedState = { ...initialOrdersHistoryState, cancelAllError: true, cancelAllFetching: false };
        expect(ordersHistoryReducer(initialState, actions.ordersCancelAllError())).toEqual(expectedState);
    });

    it('should handle ORDERS_HISTORY_CANCEL_FETCH', () => {
        const expectedState = { ...initialOrdersHistoryState, cancelFetching: true };
        const payload = { id: 8, type: 'open', list: [] };
        expect(ordersHistoryReducer(initialOrdersHistoryState, actions.ordersHistoryCancelFetch(payload))).toEqual(expectedState);
    });

    it('should handle ORDERS_HISTORY_CANCEL_DATA', () => {
        const initialState = { ...initialOrdersHistoryState, cancelFetching: true };
        const payload = [];
        const expectedState = { ...initialState, ...payload, cancelFetching: false };
        expect(ordersHistoryReducer(initialState, actions.ordersHistoryCancelData(payload))).toEqual(expectedState);
    });

    it('should handle ORDERS_HISTORY_CANCEL_ERROR', () => {
        const initialState = { ...initialOrdersHistoryState, cancelFetching: true };
        const expectedState = { ...initialOrdersHistoryState, cancelError: true, cancelFetching: false };
        expect(ordersHistoryReducer(initialState, actions.ordersHistoryCancelError())).toEqual(expectedState);
    });

    it('should handle ORDERS_HISTORY_RESET', () => {
        const initialState = { ...initialOrdersHistoryState, fetching: true };
        const expectedState = { ...initialOrdersHistoryState, list: [], pageIndex: 0, fetching: false };
        expect(ordersHistoryReducer(initialState, actions.resetOrdersHistory())).toEqual(expectedState);
    });

    describe('ORDERS_HISTORY_RANGER_DATA', () => {
        const newOrderEvent: OrderEvent = {
            id: 162,
            at: 1550180631,
            market: 'ethusd',
            kind: 'bid',
            price: '0.3',
            state: 'wait',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
        };
        const newOrderCommon: OrderCommon = {
            id: 162,
            side: 'buy',
            price: 0.3,
            state:'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: 123.1234,
            origin_volume: 123.1234,
            executed_volume: 0,
            market: 'ethusd',
        };

        it('insert new order', () => {
            const list = insertOrUpdate([], convertOrderEvent(newOrderEvent));
            const expectedState: OrdersHistoryState = { ...initialOrdersHistoryState, list };
            expect(
                ordersHistoryReducer(
                    initialOrdersHistoryState,
                    actions.userOrdersHistoryRangerData(newOrderEvent),
                ),
            ).toEqual(expectedState);
        });

        it('update order in the list', () => {
            const updatedOrderEvent: OrderEvent = {
                ...newOrderEvent,
                origin_volume: '123.1234',
                remaining_volume: '100.1234',
            };
            const list = insertOrUpdate([newOrderCommon], convertOrderEvent(updatedOrderEvent));
            const expectedState: OrdersHistoryState = {
                ...initialOrdersHistoryState,
                list,
            };

            expect(
                ordersHistoryReducer(
                    { ...initialOrdersHistoryState, list: [newOrderCommon] },
                    actions.userOrdersHistoryRangerData(updatedOrderEvent),
                ),
            ).toEqual(expectedState);
        });
    });
});

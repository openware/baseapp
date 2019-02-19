import { OrderAPI, OrderCommon, OrderEvent } from '../../types';
import * as actions from './actions';
import { convertOrderAPI, convertOrderEvent, insertOrUpdate } from './helpers';
import {
    initialOpenOrdersState,
    openOrdersReducer,
    OpenOrdersState,
} from './reducer';


describe('Open Orders reducer', () => {
    it('should handle USER_OPEN_ORDERS_FETCH', () => {
        const expectedState = { ...initialOpenOrdersState, fetching: true };
        const payload: actions.UserOpenOrdersFetch['payload'] = {
            market: {
                id: 'ethusd',
                name: 'ETH/USD',
                ask_unit: 'eth',
                bid_unit: 'usd',
                ask_fee: '0.0015',
                bid_fee: '0.0015',
                min_ask_price: '0.0',
                max_bid_price: '0.0',
                min_ask_amount: '0.0',
                min_bid_amount: '0.0',
                ask_precision: 4,
                bid_precision: 4,
            },
        };
        expect(
            openOrdersReducer(
                initialOpenOrdersState,
                actions.userOpenOrdersFetch(payload),
            ),
        ).toEqual(expectedState);
    });

    it('should handle USER_OPEN_ORDERS_DATA', () => {
        const initialState = { ...initialOpenOrdersState, fetching: true };
        const payload = [];
        const expectedState = { ...initialState, ...payload, fetching: false };
        expect(
            openOrdersReducer(initialState, actions.userOpenOrdersData(payload)),
        ).toEqual(expectedState);
    });

    it('should handle USER_OPEN_ORDERS_ERROR', () => {
        const initialState = { ...initialOpenOrdersState, fetching: true };
        const expectedState = {
            ...initialOpenOrdersState,
            list: [],
            fetching: false,
        };
        expect(
            openOrdersReducer(initialState, actions.userOpenOrdersError()),
        ).toEqual(expectedState);
    });

    describe('USER_OPEN_ORDERS_APPEND', () => {
        const newOrder: OrderAPI = {
            id: 162,
            side: 'buy',
            price: '0.3',
            ord_type: 'limit',
            state:'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
            avg_price: '0.0',
        };

        it('inserts order', () => {
            const expectedState = {
                ...initialOpenOrdersState,
                list: [convertOrderAPI(newOrder)],
            };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersAppend(newOrder),
                ),
            ).toEqual(expectedState);
        });
    });

    describe('USER_OPEN_ORDERS_UPDATE', () => {
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
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersUpdate(newOrderEvent),
                ),
            ).toEqual(expectedState);
        });

        it('does not insert done order', () => {
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list: [] };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersUpdate({...newOrderEvent, state: 'done'}),
                ),
            ).toEqual(expectedState);
        });

        it('does not insert cancel order', () => {
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list: [] };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersUpdate({...newOrderEvent, state: 'cancel'}),
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
            const expectedState: OpenOrdersState = {
                ...initialOpenOrdersState,
                list,
            };

            expect(
                openOrdersReducer(
                    { ...initialOpenOrdersState, list: [newOrderCommon] },
                    actions.userOpenOrdersUpdate(updatedOrderEvent),
                ),
            ).toEqual(expectedState);
        });

        it('remove done orders from the list', () => {
            const updatedOrderEvent: OrderEvent = {
                ...newOrderEvent,
                state: 'done',
            };
            const expectedState: OpenOrdersState = {
                ...initialOpenOrdersState,
                list: [],
            };
            expect(
                openOrdersReducer(
                    { ...initialOpenOrdersState, list: [] },
                    actions.userOpenOrdersUpdate(updatedOrderEvent),
                ),
            ).toEqual(expectedState);
        });
    });

    it('should handle USER_OPEN_ORDERS_RESET', () => {
        expect(
            openOrdersReducer(
                initialOpenOrdersState,
                actions.userOpenOrdersReset(),
            ),
        ).toEqual(initialOpenOrdersState);
    });

    it('should handle OPEN_ORDERS_CANCEL_FETCH', () => {
        const initialState = { ...initialOpenOrdersState };
        const payload = { id: 2, list: [] };
        const expectedState = {
            ...initialState,
            list: [],
            cancelFetching: true,
        };
        expect(
            openOrdersReducer(
                initialState,
                actions.openOrdersCancelFetch(payload),
            ),
        ).toEqual(expectedState);
    });

    it('should handle OPEN_ORDERS_CANCEL_DATA', () => {
        const initialState = {
            ...initialOpenOrdersState,
            cancelFetching: true,
        };
        const payload = [];
        const expectedState = {
            ...initialOpenOrdersState,
            cancelError: false,
            cancelFetching: false,
            list: [],
        };
        expect(
            openOrdersReducer(
                initialState,
                actions.openOrdersCancelData(payload),
            ),
        ).toEqual(expectedState);
    });

    it('should handle OPEN_ORDERS_CANCEL_ERROR', () => {
        const initialState = {
            ...initialOpenOrdersState,
            cancelFetching: true,
        };
        const expectedState = {
            ...initialOpenOrdersState,
            cancelError: true,
            cancelFetching: false,
        };
        expect(
            openOrdersReducer(initialState, actions.openOrdersCancelError()),
        ).toEqual(expectedState);
    });
});

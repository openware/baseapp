import { CommonError, OrderCommon, OrderEvent } from '../../types';
import * as actions from './actions';
import { convertOrderEvent, insertOrUpdate } from './helpers';
import { initialOpenOrdersState, openOrdersReducer, OpenOrdersState } from './reducer';

describe('Open Orders reducer', () => {
    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle USER_OPEN_ORDERS_FETCH', () => {
        const expectedState = { ...initialOpenOrdersState, fetching: true };
        const payload: actions.UserOpenOrdersFetch['payload'] = {
            market: {
                id: 'ethusd',
                name: 'ETH/USD',
                base_unit: 'eth',
                quote_unit: 'usd',
                min_price: '0.0',
                max_price: '0.0',
                min_amount: '0.0',
                amount_precision: 4,
                price_precision: 4,
            },
        };
        expect(openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersFetch(payload))).toEqual(expectedState);
    });

    it('should handle USER_OPEN_ORDERS_DATA', () => {
        const initialState = { ...initialOpenOrdersState, fetching: true };
        const payload = [];
        const expectedState = { ...initialState, ...payload, fetching: false };
        expect(openOrdersReducer(initialState, actions.userOpenOrdersData(payload))).toEqual(expectedState);
    });

    it('should handle USER_OPEN_ORDERS_ERROR', () => {
        const initialState = { ...initialOpenOrdersState, fetching: true };
        const expectedState = {
            ...initialOpenOrdersState,
            list: [],
            fetching: false,
        };

        expect(openOrdersReducer(initialState, actions.userOpenOrdersError(error))).toEqual(expectedState);
    });

    describe('USER_OPEN_ORDERS_APPEND', () => {
        const newOrder: OrderCommon = {
            id: 162,
            confirmed: true,
            side: 'buy',
            price: '0.3',
            ord_type: 'limit',
            state: 'wait',
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
                list: [newOrder],
            };
            expect(openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersAppend(newOrder))).toEqual(
                expectedState
            );
        });
    });

    describe('USER_OPEN_ORDERS_APPEND UUID', () => {
        const newOrder: OrderCommon = {
            uuid: '3ea3e2e4-5d29-11ea-a122-0242ac140008',
            confirmed: false,
            side: 'buy',
            price: '0.3',
            ord_type: 'limit',
            state: 'wait',
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
                list: [newOrder],
            };
            expect(openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersAppend(newOrder))).toEqual(
                expectedState
            );
        });
    });

    describe('USER_OPEN_ORDERS_UPDATE', () => {
        const newOrderEvent: OrderEvent = {
            id: 162,
            at: 1550180631,
            market: 'ethusd',
            side: 'buy',
            kind: 'bid',
            price: '0.3',
            state: 'wait',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
        };

        const newOrderWithUUIDEvent: OrderEvent = {
            uuid: '3ea3e2e4-5d29-11ea-a122-0242ac140008',
            at: 1550180631,
            market: 'ethusd',
            side: 'buy',
            kind: 'bid',
            price: '0.3',
            state: 'wait',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
        };

        const newOrderCommon: OrderCommon = {
            id: 162,
            side: 'buy',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
        };

        it('insert new order by ID', () => {
            const list = insertOrUpdate([], convertOrderEvent(newOrderEvent));
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list };
            expect(openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersUpdate(newOrderEvent))).toEqual(
                expectedState
            );
        });

        it('insert new order by UUID', () => {
            const list = insertOrUpdate([], convertOrderEvent(newOrderWithUUIDEvent));
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list };
            expect(
                openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersUpdate(newOrderWithUUIDEvent))
            ).toEqual(expectedState);
        });

        it('does not insert done order', () => {
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list: [] };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersUpdate({ ...newOrderEvent, state: 'done' })
                )
            ).toEqual(expectedState);
        });

        it('does not insert cancel order', () => {
            const expectedState: OpenOrdersState = { ...initialOpenOrdersState, list: [] };
            expect(
                openOrdersReducer(
                    initialOpenOrdersState,
                    actions.userOpenOrdersUpdate({ ...newOrderEvent, state: 'cancel' })
                )
            ).toEqual(expectedState);
        });

        it('update order in the list by ID', () => {
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
                    actions.userOpenOrdersUpdate(updatedOrderEvent)
                )
            ).toEqual(expectedState);
        });

        it('update order in the list by UUID', () => {
            const updatedOrderEvent: OrderEvent = {
                ...newOrderWithUUIDEvent,
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
                    actions.userOpenOrdersUpdate(updatedOrderEvent)
                )
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
                    actions.userOpenOrdersUpdate(updatedOrderEvent)
                )
            ).toEqual(expectedState);
        });
    });

    it('should handle USER_OPEN_ORDERS_RESET', () => {
        expect(openOrdersReducer(initialOpenOrdersState, actions.userOpenOrdersReset())).toEqual(
            initialOpenOrdersState
        );
    });

    it('should handle OPEN_ORDERS_CANCEL_FETCH', () => {
        const orderToCancel: OrderCommon = {
            id: 162,
            side: 'buy',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
        };

        const initialState = { ...initialOpenOrdersState };
        const payload = { order: orderToCancel, list: [] };
        const expectedState = {
            ...initialState,
            list: [],
            cancelFetching: true,
        };
        expect(openOrdersReducer(initialState, actions.openOrdersCancelFetch(payload))).toEqual(expectedState);
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
        expect(openOrdersReducer(initialState, actions.openOrdersCancelData(payload))).toEqual(expectedState);
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
        expect(openOrdersReducer(initialState, actions.openOrdersCancelError(error))).toEqual(expectedState);
    });
});

import { OrderAPI, OrderCommon, OrderEvent } from '../../types';
import * as actions from './actions';
import { OPEN_ORDERS_APPEND, OPEN_ORDERS_CANCEL_DATA, OPEN_ORDERS_CANCEL_ERROR, OPEN_ORDERS_CANCEL_FETCH, OPEN_ORDERS_DATA, OPEN_ORDERS_ERROR, OPEN_ORDERS_FETCH, OPEN_ORDERS_RESET, OPEN_ORDERS_UPDATE } from './constants';

describe('Open Orders actions', () => {
    it('should check userOpenOrdersFetch action creator', () => {
        const payload = {
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
        const expectedAction = { type: OPEN_ORDERS_FETCH, payload };
        expect(actions.userOpenOrdersFetch(payload)).toEqual(expectedAction);
    });

    it('should check userOpenOrdersData action creator', () => {
        const payload = [];
        const expectedAction = { type: OPEN_ORDERS_DATA, payload };
        expect(actions.userOpenOrdersData(payload)).toEqual(expectedAction);
    });

    it('should check userOpenOrdersError action creator', () => {
        const expectedAction = { type: OPEN_ORDERS_ERROR };
        expect(actions.userOpenOrdersError()).toEqual(expectedAction);
    });

    it('should check userOpenOrdersAppend action creator', () => {
        const payload: OrderAPI = {
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
        const expectedAction = { type: OPEN_ORDERS_APPEND, payload };
        expect(actions.userOpenOrdersAppend(payload)).toEqual(expectedAction);
    });

    it('should check userOpenOrdersAppend Finex action creator', () => {
        const payload: OrderAPI = {
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
        const expectedAction = { type: OPEN_ORDERS_APPEND, payload };
        expect(actions.userOpenOrdersAppend(payload)).toEqual(expectedAction);
    });

    it('should check userOpenOrdersUpdate action creator', () => {
        const payload: OrderEvent = {
            id: 1,
            at: 123123123,
            market: 'ethusd',
            kind: 'bid',
            price: '0.3',
            state: 'wait',
            remaining_volume: '1.213432',
            origin_volume: '3.234234',
        };
        const expectedAction = { type: OPEN_ORDERS_UPDATE, payload };
        expect(actions.userOpenOrdersUpdate(payload)).toEqual(expectedAction);
    });

    it('should check userOpenOrdersReset action creator', () => {
        const expectedAction = { type: OPEN_ORDERS_RESET };
        expect(actions.userOpenOrdersReset()).toEqual(expectedAction);
    });

    it('should check openOrdersCancelFetch action creator', () => {
        const orderToCancel: OrderCommon = {
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

        const payload = {
            order: orderToCancel,
            list: [],
        };
        const expectedAction = { type: OPEN_ORDERS_CANCEL_FETCH, payload };
        expect(actions.openOrdersCancelFetch(payload)).toEqual(expectedAction);
    });

    it('should check openOrdersCancelData action creator', () => {
        const payload = [];
        const expectedAction = { type: OPEN_ORDERS_CANCEL_DATA, payload };
        expect(actions.openOrdersCancelData(payload)).toEqual(expectedAction);
    });

    it('should check openOrdersCancelError action creator', () => {
        const expectedAction = { type: OPEN_ORDERS_CANCEL_ERROR };
        expect(actions.openOrdersCancelError()).toEqual(expectedAction);
    });
});

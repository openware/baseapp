import * as actions from './actions';
import {
    IEO_HISTORY_DATA,
    IEO_HISTORY_ERROR,
    IEO_HISTORY_FETCH,
    IEO_ORDER_CANCEL_DATA,
    IEO_ORDER_CANCEL_ERROR,
    IEO_ORDER_CANCEL_FETCH,
    IEO_ORDER_EXECUTE_DATA,
    IEO_ORDER_EXECUTE_ERROR,
    IEO_ORDER_EXECUTE_FETCH,
    IEO_ORDERS_DATA,
    IEO_ORDERS_ERROR,
    IEO_ORDERS_FETCH,
} from './constants';
import { OrderIEOData } from './types';

describe('IEO order execute actions', () => {
    const fakeIEO = {
        sale: 1,
        quote_unit: 'xrp',
        contribution: 10,
    };

    const fakeOrder: OrderIEOData = {
        id: 1,
        sale_name: 'Test1',
        sale_pair_id: 672,
        uid: 'UID6D6B9493F0',
        contribution: '27.3941',
        executed: '0.0',
        refunded: '27.3941',
        tokens_received: '0.0',
        commission_rate: '0.0004',
        commission_amount: '0.0',
        state: 'cancelled',
        created_at: '2019-10-03T11:51:08.000Z',
        updated_at: '2019-10-03T11:51:08.000Z',
        tokens_ordered: '0.3954',
        ratio: '0.2',
        base_currency: 'eth',
        quote_currency: 'btc',
    };

    it('should check ieoOrderExecuteFetch action creator', () => {
        const expectedAction = { type: IEO_ORDER_EXECUTE_FETCH, payload: fakeIEO };
        expect(actions.ieoOrderExecuteFetch(fakeIEO)).toEqual(expectedAction);
    });

    it('should check ieoOrderExecuteData action creator', () => {
        const expectedAction = { type: IEO_ORDER_EXECUTE_DATA, payload: fakeOrder };
        expect(actions.ieoOrderExecuteData(fakeOrder)).toEqual(expectedAction);
    });

    it('should check ieoOrderExecuteError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ORDER_EXECUTE_ERROR, payload };
        expect(actions.ieoOrderExecuteError(payload)).toEqual(expectedAction);
    });
});

describe('IEO orders fetch actions', () => {
    const fakePayload: OrderIEOData[] = [
        {
            id: 1,
            sale_name: 'Test1',
            sale_pair_id: 672,
            uid: 'UID6D6B9493F0',
            contribution: '27.3941',
            executed: '0.0',
            refunded: '27.3941',
            tokens_received: '0.0',
            commission_rate: '0.0004',
            commission_amount: '0.0',
            state: 'cancelled',
            created_at: '2019-10-03T11:51:08.000Z',
            updated_at: '2019-10-03T11:51:08.000Z',
            tokens_ordered: '0.3954',
            ratio: '0.31',
            base_currency: 'eth',
            quote_currency: 'btc',

        },
        {
            id: 2,
            sale_name: 'Test2',
            sale_pair_id: 321,
            uid: 'UID6D6B941233',
            contribution: '19.4323',
            executed: '0.0',
            refunded: '19.4323',
            tokens_received: '0.0',
            commission_rate: '0.0005',
            commission_amount: '0.0',
            state: 'cancelled',
            created_at: '2019-10-05T12:51:08.000Z',
            updated_at: '2019-10-05T12:51:08.000Z',
            tokens_ordered: '0.5832',
            ratio: '0.31',
            base_currency: 'eth',
            quote_currency: 'btc',

        },
    ];

    it('should check ieoOrdersFetch action creator', () => {
        const expectedAction = { type: IEO_ORDERS_FETCH };
        expect(actions.ieoOrdersFetch()).toEqual(expectedAction);
    });

    it('should check ieoOrdersData action creator', () => {
        const expectedAction = { type: IEO_ORDERS_DATA, payload: fakePayload };
        expect(actions.ieoOrdersData(fakePayload)).toEqual(expectedAction);
    });

    it('should check ieoOrdersError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ORDERS_ERROR, payload };
        expect(actions.ieoOrdersError(payload)).toEqual(expectedAction);
    });

    it('should check ieoHistoryFetch action creator', () => {
        const expectedAction = { type: IEO_HISTORY_FETCH, payload: { limit: 2, page: 0 } };
        expect(actions.ieoHistoryFetch({ page: 0, limit: 2 })).toEqual(expectedAction);
    });

    it('should check ieoHistoryData action creator', () => {
        const expectedAction = { type: IEO_HISTORY_DATA, payload: { list: fakePayload, total: 2, page: 0 } };
        expect(actions.ieoHistoryData({ list: fakePayload, total: 2, page: 0 })).toEqual(expectedAction);
    });

    it('should check ieoHistoryError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_HISTORY_ERROR, payload };
        expect(actions.ieoHistoryError(payload)).toEqual(expectedAction);
    });

    const fakeOrder: OrderIEOData = {
        id: 1,
        sale_name: 'Test',
        sale_pair_id: 672,
        uid: 'UID6D6B9493F0',
        contribution: '27.3941',
        executed: '0.0',
        refunded: '27.3941',
        tokens_received: '0.0',
        commission_rate: '0.0004',
        commission_amount: '0.0',
        state: 'cancelled',
        created_at: '2019-10-03T11:51:08.000Z',
        updated_at: '2019-10-03T11:51:08.000Z',
        tokens_ordered: '0.3954',
        ratio: '0.31',
        base_currency: 'eth',
        quote_currency: 'btc',
    };

    it('should check ieoOrderCancel action creator', () => {
        const payload = { id: 1 };
        const expectedAction = { type: IEO_ORDER_CANCEL_FETCH, payload };
        expect(actions.ieoOrderCancel(payload)).toEqual(expectedAction);
    });

    it('should check ieoOrderCancelData action creator', () => {
        const expectedAction = { type: IEO_ORDER_CANCEL_DATA, payload: fakeOrder };
        expect(actions.ieoOrderCancelData(fakeOrder)).toEqual(expectedAction);
    });

    it('should check ieoOrderCancelError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: IEO_ORDER_CANCEL_ERROR, payload };
        expect(actions.ieoOrderCancelError(payload)).toEqual(expectedAction);
    });
});

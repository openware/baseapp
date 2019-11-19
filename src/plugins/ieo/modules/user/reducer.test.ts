import * as actions from './actions';
import { ieoOrderReducer, initialOrderIEOState } from './reducer';
import { OrderIEOData } from './types';

describe('IEO order cancel reducer', () => {
    const fakePayload = {
        id: 1,
    };

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

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle IEO_ORDER_CANCEL_FETCH', () => {
        const expectedState = {
            ...initialOrderIEOState,
            cancel: {
                ...initialOrderIEOState.cancel,
                loading: true,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderCancel(fakePayload))).toEqual(expectedState);
    });

    it('should handle IEO_ORDER_CANCEL_DATA', () => {
        const expectedState = {
            ...initialOrderIEOState,
            cancel: {
                ...initialOrderIEOState.cancel,
                success: true,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderCancelData(fakeOrder))).toEqual(expectedState);
    });

    it('should handle IEO_ORDER_CANCEL_ERROR', () => {
        const expectedState = {
            ...initialOrderIEOState,
            cancel: {
                ...initialOrderIEOState.cancel,
                error: error,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderCancelError(error))).toEqual(expectedState);
    });
});

describe('IEO order execute reducer', () => {
    const fakeIEO = {
        sale: 1,
        quote_unit: 'xrp',
        contribution: 10,
    };

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
        ratio: '0.3',
        base_currency: 'eth',
        quote_currency: 'btc',
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle IEO_ORDER_EXECUTE_FETCH', () => {
        const expectedState = {
            ...initialOrderIEOState,
            execute: {
                ...initialOrderIEOState.execute,
                loading: true,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderExecuteFetch(fakeIEO))).toEqual(expectedState);
    });

    it('should handle IEO_ORDER_EXECUTE_DATA', () => {
        const expectedState = {
            ...initialOrderIEOState,
            execute: {
                ...initialOrderIEOState.execute,
                success: true,
                data: fakeOrder,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderExecuteData(fakeOrder))).toEqual(expectedState);
    });

    it('should handle IEO_ORDER_EXECUTE_ERROR', () => {
        const expectedState = {
            ...initialOrderIEOState,
            execute: {
                ...initialOrderIEOState.execute,
                error: error,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrderExecuteError(error))).toEqual(expectedState);
    });
});

describe('IEO orders fetch reducer', () => {
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

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle IEO_ORDERS_FETCH', () => {
        const expectedState = {
            ...initialOrderIEOState,
            fetch: {
                ...initialOrderIEOState.fetch,
                loading: true,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrdersFetch())).toEqual(expectedState);
    });

    it('should handle IEO_ORDERS_DATA', () => {
        const expectedState = {
            ...initialOrderIEOState,
            fetch: {
                ...initialOrderIEOState.fetch,
                success: true,
                data: fakePayload,
            },
         };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrdersData(fakePayload))).toEqual(expectedState);
    });

    it('should handle IEO_ORDERS_ERROR', () => {
        const expectedState = {
            ...initialOrderIEOState,
            fetch: {
                ...initialOrderIEOState.fetch,
                error: error,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoOrdersError(error))).toEqual(expectedState);
    });

    it('should handle IEO_HISTORY_FETCH', () => {
        const expectedState = {
            ...initialOrderIEOState,
            history: {
                ...initialOrderIEOState.history,
                loading: true,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoHistoryFetch({ page: 0, limit: 2 }))).toEqual(expectedState);
    });

    it('should handle IEO_HISTORY_DATA', () => {
        const expectedState = {
            ...initialOrderIEOState,
            history: {
                ...initialOrderIEOState.history,
                success: true,
                data: fakePayload,
                total: 0,
            },
         };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoHistoryData({ list: fakePayload, total: 0, page: 0 }))).toEqual(expectedState);
    });

    it('should handle IEO_HISTORY_ERROR', () => {
        const expectedState = {
            ...initialOrderIEOState,
            history: {
                ...initialOrderIEOState.history,
                error: error,
            },
        };

        expect(ieoOrderReducer(initialOrderIEOState, actions.ieoHistoryError(error))).toEqual(expectedState);
    });
});

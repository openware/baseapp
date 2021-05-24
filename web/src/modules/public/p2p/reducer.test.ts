import { CommonError } from '../../types';
import * as actions from './actions';
import { p2pReducer, initialP2PState } from './reducer';
import { Offer, P2PCurrency, PaymentMethod } from './types';

describe('P2P reducer', () => {
    const fakeOffersArray: Offer[] = [
        {
            id: 1,
            price: 1.2,
            available_amount: '5534.00',
            origin_amount: '7666.00',
            min_order_amount: '15',
            max_order_amount: '5000',
            base: 'usdt',
            quote: 'ngn',
            state: 'pending',
            created_at: '',
            side: 'buy',
            payment_methods: [],
            time_limit: 1,
            uid: 'ID787E383938',
            user: {
                user_nickname: 'King_Coin66',
                offers_count: 123,
                success_rate: 1,
                user_uid: 'ID787E383938',
            },
        },
        {
            id: 2,
            price: 1.2,
            available_amount: '5534.00',
            origin_amount: '7666.00',
            min_order_amount: '15',
            max_order_amount: '5000',
            base: 'usdt',
            quote: 'ngn',
            state: 'pending',
            created_at: '',
            side: 'buy',
            payment_methods: [],
            time_limit: 1,
            uid: 'ID787E383938',
            user: {
                user_nickname: 'King_Coin66',
                offers_count: 123,
                success_rate: 1,
                user_uid: 'ID787E383938',
            },
        },
    ];

    const fakeP2PCurrenciesArray: P2PCurrency[] = [
        {
            id: 'usdt',
            type: 'coin',
            enabled: true,
        },
        {
            id: 'usdt',
            type: 'coin',
            enabled: true,
        },
    ];

    const fakeP2PPaymentMethods: PaymentMethod[] = [
        {
            id: 1,
            type: '',
            name: 'Universal',
            options: {},
        },
        {
            id: 2,
            type: '',
            name: 'Universal',
            options: {},
        },
    ];

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle offersFetch', () => {
        const expectedState = {
            ...initialP2PState,
            offers: {
                ...initialP2PState.offers,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pReducer(initialP2PState, actions.offersFetch({ page: 0, limit: 1, side: 'buy', base: '', quote: '' }))).toEqual(expectedState);
    });

    it('should handle offersData', () => {
        const expectedState = {
            ...initialP2PState,
            offers: {
                ...initialP2PState.offers,
                list: fakeOffersArray,
                fetching: false,
                success: true,
                page: 1,
                total: 2,
            },
         };

        expect(p2pReducer(initialP2PState, actions.offersData({ list: fakeOffersArray, page: 1, total: 2, side: '', base: '', quote: '' }))).toEqual(expectedState);
    });

    it('should handle offersError', () => {
        const expectedState = {
            ...initialP2PState,
            offers: {
                ...initialP2PState.offers,
                list: [],
                fetching: false,
                success: false,
                error: error,
                page: 0,
                total: 0,
            },
        };

        expect(p2pReducer(initialP2PState, actions.offersError(error))).toEqual(expectedState);
    });

    it('should handle p2pCurrenciesFetch', () => {
        const expectedState = {
            ...initialP2PState,
            currencies: {
                ...initialP2PState.currencies,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pReducer(initialP2PState, actions.p2pCurrenciesFetch())).toEqual(expectedState);
    });

    it('should handle p2pCurrenciesData', () => {
        const expectedState = {
            ...initialP2PState,
            currencies: {
                ...initialP2PState.currencies,
                data: fakeP2PCurrenciesArray,
                fetching: false,
                success: true,
            },
         };

        expect(p2pReducer(initialP2PState, actions.p2pCurrenciesData(fakeP2PCurrenciesArray))).toEqual(expectedState);
    });

    it('should handle p2pCurrenciesError', () => {
        const expectedState = {
            ...initialP2PState,
            currencies: {
                ...initialP2PState.currencies,
                data: [],
                fetching: false,
                success: false,
                error: error,
            },
        };

        expect(p2pReducer(initialP2PState, actions.p2pCurrenciesError(error))).toEqual(expectedState);
    });

    it('should handle p2pPaymentMethodsFetch', () => {
        const expectedState = {
            ...initialP2PState,
            paymentMethods: {
                ...initialP2PState.paymentMethods,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pReducer(initialP2PState, actions.p2pPaymentMethodsFetch())).toEqual(expectedState);
    });

    it('should handle p2pPaymentMethodsData', () => {
        const expectedState = {
            ...initialP2PState,
            paymentMethods: {
                ...initialP2PState.paymentMethods,
                data: fakeP2PPaymentMethods,
                fetching: false,
                success: true,
            },
         };

        expect(p2pReducer(initialP2PState, actions.p2pPaymentMethodsData(fakeP2PPaymentMethods))).toEqual(expectedState);
    });

    it('should handle p2pPaymentMethodsError', () => {
        const expectedState = {
            ...initialP2PState,
            paymentMethods: {
                ...initialP2PState.paymentMethods,
                data: [],
                fetching: false,
                success: false,
                error: error,
            },
        };

        expect(p2pReducer(initialP2PState, actions.p2pPaymentMethodsError(error))).toEqual(expectedState);
    });
});

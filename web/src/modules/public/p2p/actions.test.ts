import { CommonError } from '../../types';
import * as actions from './actions';
import {
    P2P_CURRENCIES_DATA,
    P2P_CURRENCIES_ERROR,
    P2P_CURRENCIES_FETCH,
    P2P_OFFERS_DATA,
    P2P_OFFERS_ERROR,
    P2P_OFFERS_FETCH,
    P2P_PAYMENT_METHODS_DATA,
    P2P_PAYMENT_METHODS_ERROR,
    P2P_PAYMENT_METHODS_FETCH,
} from './constants';
import { Offer, P2PCurrency, PaymentMethod } from './types';

describe('P2P actions', () => {
    const fakeOffersArray: Offer[] = [
        {
            id: 1,
            user: {
                user_nickname: 'King_Coin66',
                offers_count: 1,
                user_uid: '',
                success_rate: '',
            },
            uid: '',
            price: 1.2,
            available_amount: '5534.00',
            origin_amount: '7666.00',
            min_order_amount: '15',
            max_order_amount: '5000',
            base: 'usdt',
            side: 'buy',
            quote: 'ngn',
            state: 'pending',
            created_at: '',
            time_limit: 0,
            payment_methods: [],
        },
        {
            id: 1,
            user: {
                user_nickname: 'King_Coin66',
                offers_count: 1,
                user_uid: '',
                success_rate: '',
            },
            uid: '',
            price: 1.2,
            available_amount: '5534.00',
            origin_amount: '7666.00',
            min_order_amount: '15',
            max_order_amount: '5000',
            base: 'usdt',
            side: 'buy',
            quote: 'ngn',
            state: 'pending',
            created_at: '',
            time_limit: 0,
            payment_methods: [],
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

    const fakeError: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check offersFetch action creator', () => {
        const expectedAction = { type: P2P_OFFERS_FETCH, payload: { page: 0, limit: 25, side: 'buy', base: '', quote: '' } };
        expect(actions.offersFetch({ page: 0, limit: 25, side: 'buy', base: '', quote: '' })).toEqual(expectedAction);
    });

    it('should check offersData action creator', () => {
        const payload = { list: fakeOffersArray, page: 1, total: 2, side: '', base: '', quote: '' };
        const expectedAction = { type: P2P_OFFERS_DATA, payload };
        expect(actions.offersData(payload)).toEqual(expectedAction);
    });

    it('should check offersError action creator', () => {
        const expectedAction = { type: P2P_OFFERS_ERROR, error: fakeError };
        expect(actions.offersError(fakeError)).toEqual(expectedAction);
    });

    it('should check p2pCurrenciesFetch action creator', () => {
        const expectedAction = { type: P2P_CURRENCIES_FETCH };
        expect(actions.p2pCurrenciesFetch()).toEqual(expectedAction);
    });

    it('should check p2pCurrenciesData action creator', () => {
        const payload = fakeP2PCurrenciesArray;
        const expectedAction = { type: P2P_CURRENCIES_DATA, payload };
        expect(actions.p2pCurrenciesData(payload)).toEqual(expectedAction);
    });

    it('should check P2PCurrenciesError action creator', () => {
        const expectedAction = { type: P2P_CURRENCIES_ERROR, error: fakeError };
        expect(actions.p2pCurrenciesError(fakeError)).toEqual(expectedAction);
    });

    it('should check p2pPaymentMethodsFetch action creator', () => {
        const expectedAction = { type: P2P_PAYMENT_METHODS_FETCH };
        expect(actions.p2pPaymentMethodsFetch()).toEqual(expectedAction);
    });

    it('should check p2pPaymentMethodsData action creator', () => {
        const payload = fakeP2PPaymentMethods;
        const expectedAction = { type: P2P_PAYMENT_METHODS_DATA, payload };
        expect(actions.p2pPaymentMethodsData(payload)).toEqual(expectedAction);
    });

    it('should check p2pPaymentMethodsError action creator', () => {
        const expectedAction = { type: P2P_PAYMENT_METHODS_ERROR, error: fakeError };
        expect(actions.p2pPaymentMethodsError(fakeError)).toEqual(expectedAction);
    });
});

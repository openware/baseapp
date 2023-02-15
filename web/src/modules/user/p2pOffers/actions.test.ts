import { Offer } from 'src/modules';
import { CommonError } from '../../types';
import * as actions from './actions';
import {
    P2P_CANCEL_OFFER_DATA,
    P2P_CANCEL_OFFER_ERROR,
    P2P_CANCEL_OFFER_FETCH,
    P2P_CREATE_OFFER_DATA,
    P2P_CREATE_OFFER_ERROR,
    P2P_CREATE_OFFER_FETCH,
} from './constants';

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

    const fakeError: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const fakeCreateOfferPayload = {
        price: 1.2,
        side: 'buy',
        amount: '5534.00',
        min_order_amount: '15',
        max_order_amount: '5000',
        base: 'usdt',
        quote: 'ngn',
        upm_id: [1],
        time_limit: '15',
        description: '',
    };

    const fakeOfferCancelPayload = { id: 2, list: [] };

    it('should check createOffer action creator', () => {
        const expectedAction = { type: P2P_CREATE_OFFER_FETCH, payload: fakeCreateOfferPayload };
        expect(actions.createOffer(fakeCreateOfferPayload)).toEqual(expectedAction);
    });

    it('should check createOfferData action creator', () => {
        const expectedAction = { type: P2P_CREATE_OFFER_DATA };
        expect(actions.createOfferData()).toEqual(expectedAction);
    });

    it('should check createOfferError action creator', () => {
        const expectedAction = { type: P2P_CREATE_OFFER_ERROR, error: fakeError };
        expect(actions.createOfferError(fakeError)).toEqual(expectedAction);
    });

    it('should check cancelOffer action creator', () => {
        const expectedAction = { type: P2P_CANCEL_OFFER_FETCH, payload: fakeOfferCancelPayload };
        expect(actions.cancelOffer(fakeOfferCancelPayload)).toEqual(expectedAction);
    });

    it('should check cancelOfferData action creator', () => {
        const payload = fakeOffersArray;
        const expectedAction = { type: P2P_CANCEL_OFFER_DATA, payload };
        expect(actions.cancelOfferData(payload)).toEqual(expectedAction);
    });

    it('should check cancelOfferError action creator', () => {
        const expectedAction = { type: P2P_CANCEL_OFFER_ERROR, error: fakeError };
        expect(actions.cancelOfferError(fakeError)).toEqual(expectedAction);
    });
});

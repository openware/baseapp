import { Offer } from 'src/modules';
import { CommonError } from '../../types';
import * as actions from './actions';
import { p2pOffersReducer, initialP2POffersState } from './reducer';

describe('User P2P Offers reducer', () => {
    const fakeOffersArray: Offer[] = [
        {
            id: 1,
            user_nickname: 'King_Coin66',
            offers_count: 123,
            success_rate: 1,
            price: 1.2,
            available_amount: '5534.00',
            origin_amount: '7666.00',
            min_order_amount: '15',
            max_order_amount: '5000',
            base: 'usdt',
            quote: 'ngn',
            state: 'pending',
            created_at: '',
            upm_id: ['1'],
            side: 'buy',
        },
        {
            id: 2,
            user_nickname: 'King_Coin66',
            offers_count: 123,
            success_rate: 1,
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
            upm_id: ['1'],
        },
    ];

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle activeOffersFetch', () => {
        const expectedState = {
            ...initialP2POffersState,
            activeOffers: {
                ...initialP2POffersState.activeOffers,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.activeOffersFetch({ page: 0, limit: 1 }))).toEqual(expectedState);
    });

    it('should handle activeOffersData', () => {
        const expectedState = {
            ...initialP2POffersState,
            activeOffers: {
                ...initialP2POffersState.activeOffers,
                list: fakeOffersArray,
                fetching: false,
                success: true,
                page: 1,
                total: 2,
            },
         };

        expect(p2pOffersReducer(initialP2POffersState, actions.activeOffersData({ list: fakeOffersArray, page: 1, total: 2 }))).toEqual(expectedState);
    });

    it('should handle activeOffersError', () => {
        const expectedState = {
            ...initialP2POffersState,
            activeOffers: {
                ...initialP2POffersState.activeOffers,
                list: [],
                fetching: false,
                success: false,
                error: error,
                page: 0,
                total: 0,
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.activeOffersError(error))).toEqual(expectedState);
    });

    it('should handle cancelledOffersFetch', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelledOffers: {
                ...initialP2POffersState.cancelledOffers,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelledOffersFetch({ page: 0, limit: 1 }))).toEqual(expectedState);
    });

    it('should handle cancelledOffersData', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelledOffers: {
                ...initialP2POffersState.cancelledOffers,
                list: fakeOffersArray,
                fetching: false,
                success: true,
                page: 1,
                total: 2,
            },
         };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelledOffersData({ list: fakeOffersArray, page: 1, total: 2 }))).toEqual(expectedState);
    });

    it('should handle cancelledOffersError', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelledOffers: {
                ...initialP2POffersState.cancelledOffers,
                list: [],
                fetching: false,
                success: false,
                error: error,
                page: 0,
                total: 0,
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelledOffersError(error))).toEqual(expectedState);
    });

    const fakeCreateOfferPayload = {
        price: 1.2,
        amount: '5534.00',
        min_order_amount: '15',
        max_order_amount: '5000',
        base: 'usdt',
        quote: 'ngn',
        upm_id: ['1'],
        time_limit: '15',
        side: 'buy',
        description: '',
    };

    it('should handle createOffer', () => {
        const expectedState = {
            ...initialP2POffersState,
            createOffer: {
                ...initialP2POffersState.createOffer,
                loading: true,
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.createOffer(fakeCreateOfferPayload))).toEqual(expectedState);
    });

    it('should handle createOfferData', () => {
        const expectedState = {
            ...initialP2POffersState,
            createOffer: {
                ...initialP2POffersState.createOffer,
                loading: false,
                success: true,
            },
         };

        expect(p2pOffersReducer(initialP2POffersState, actions.createOfferData())).toEqual(expectedState);
    });

    it('should handle createOfferError', () => {
        const expectedState = {
            ...initialP2POffersState,
            createOffer: {
                ...initialP2POffersState.createOffer,
                loading: false,
                success: false,
                error: error,
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.createOfferError(error))).toEqual(expectedState);
    });

    const fakeOfferCancelPayload = { id: 2, list: [] };

    it('should handle cancelOffer', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelOffer: {
                ...initialP2POffersState.cancelOffer,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelOffer(fakeOfferCancelPayload))).toEqual(expectedState);
    });

    it('should handle cancelOfferData', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelOffer: {
                ...initialP2POffersState.cancelOffer,
                list: fakeOffersArray,
                loading: false,
                success: true,
            },
         };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelOfferData(fakeOffersArray))).toEqual(expectedState);
    });

    it('should handle cancelOfferError', () => {
        const expectedState = {
            ...initialP2POffersState,
            cancelOffer: {
                ...initialP2POffersState.cancelOffer,
                list: [],
                loading: false,
                success: false,
                error: error,
            },
        };

        expect(p2pOffersReducer(initialP2POffersState, actions.cancelOfferError(error))).toEqual(expectedState);
    });
});

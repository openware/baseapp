import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PActions } from './actions';
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

export interface P2PState {
    currencies: {
        data: P2PCurrency[];
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    paymentMethods: {
        data: PaymentMethod[];
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    offers: {
        page: number;
        total: number;
        list: Offer[];
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
}

export const initialP2PState: P2PState = {
    currencies: {
        data: [],
        fetching: false,
        success: false,
    },
    paymentMethods: {
        data: [],
        fetching: false,
        success: false,
    },
    offers: {
        page: 0,
        total: 0,
        list: [],
        fetching: false,
        success: false,
    },
};

export const p2pOffersFetchReducer = (state: P2PState['offers'], action: P2PActions) => {
    switch (action.type) {
        case P2P_OFFERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_OFFERS_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                page: action.payload.page,
                total: action.payload.total,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                total: 0,
                list: [],
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pCurrenciesReducer = (state: P2PState['currencies'], action: P2PActions) => {
    switch (action.type) {
        case P2P_CURRENCIES_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_CURRENCIES_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_CURRENCIES_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPaymentMethodsReducer = (state: P2PState['paymentMethods'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PAYMENT_METHODS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PAYMENT_METHODS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_METHODS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pReducer = (state = initialP2PState, action: P2PActions) => {
    switch (action.type) {
        case P2P_CURRENCIES_FETCH:
        case P2P_CURRENCIES_DATA:
        case P2P_CURRENCIES_ERROR:
            const p2pCurrenciesState = { ...state.currencies };

            return {
                ...state,
                currencies: p2pCurrenciesReducer(p2pCurrenciesState, action),
            };
        case P2P_PAYMENT_METHODS_FETCH:
        case P2P_PAYMENT_METHODS_DATA:
        case P2P_PAYMENT_METHODS_ERROR:
            const p2pPaymentMethodsState = { ...state.paymentMethods };

            return {
                ...state,
                paymentMethods: p2pPaymentMethodsReducer(p2pPaymentMethodsState, action),
            };
        case P2P_OFFERS_FETCH:
        case P2P_OFFERS_DATA:
        case P2P_OFFERS_ERROR:
            const p2pOffersFetchState = { ...state.offers };

            return {
                ...state,
                offers: p2pOffersFetchReducer(p2pOffersFetchState, action),
            };
        default:
            return state;
    }
};

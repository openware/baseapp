import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PActions } from './actions';
import {
    P2P_CURRENCIES_DATA,
    P2P_CURRENCIES_ERROR,
    P2P_CURRENCIES_FETCH,
    P2P_HIGHEST_PRICE_DATA,
    P2P_HIGHEST_PRICE_ERROR,
    P2P_HIGHEST_PRICE_FETCH,
    P2P_OFFERS_DATA,
    P2P_OFFERS_ERROR,
    P2P_OFFERS_FETCH,
    P2P_OFFERS_UPDATE,
    P2P_PAYMENT_METHODS_DATA,
    P2P_PAYMENT_METHODS_ERROR,
    P2P_PAYMENT_METHODS_FETCH,
} from './constants';
import { insertOrUpdate } from './helpers';
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
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    highestPrice: {
        data: string;
        fetching: boolean;
        error?: CommonError;
        timestamp?: number;
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
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    },
    highestPrice: {
        data: '',
        fetching: false,
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
                side: action.payload.side,
                base: action.payload.base,
                quote: action.payload.quote,
                payment_method: action.payload.payment_method,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFERS_UPDATE:
            const newList = sliceArray(
                insertOrUpdate(state.list, action.payload, state.side, state.base, state.quote, state.payment_method),
                defaultStorageLimit(),
            );

            return {
                ...state,
                list: newList,
                total: newList.length,
            };
        case P2P_OFFERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                side: '',
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

const p2pHighestPriceReducer = (state: P2PState['highestPrice'], action: P2PActions) => {
    switch (action.type) {
        case P2P_HIGHEST_PRICE_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_HIGHEST_PRICE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                error: undefined,
            };
        case P2P_HIGHEST_PRICE_ERROR:
            return {
                ...state,
                fetching: false,
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
        case P2P_OFFERS_UPDATE:
            const p2pOffersFetchState = { ...state.offers };

            return {
                ...state,
                offers: p2pOffersFetchReducer(p2pOffersFetchState, action),
            };
        case P2P_HIGHEST_PRICE_FETCH:
        case P2P_HIGHEST_PRICE_DATA:
        case P2P_HIGHEST_PRICE_ERROR:
            const p2pHighestPriceState = { ...state.highestPrice };

            return {
                ...state,
                highestPrice: p2pHighestPriceReducer(p2pHighestPriceState, action),
            };
        default:
            return state;
    }
};

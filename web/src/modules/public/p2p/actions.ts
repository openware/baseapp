import { CommonError } from '../../types';
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
import { Offer, P2PCurrency, PaymentMethod } from './types';

export interface OffersFetch {
    type: typeof P2P_OFFERS_FETCH;
    payload: {
        page: number;
        limit: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method?: number;
    };
}

export interface OffersData {
    type: typeof P2P_OFFERS_DATA;
    payload: {
        list: Offer[];
        page: number;
        total: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method?: number;
    };
}

export interface OffersError {
    type: typeof P2P_OFFERS_ERROR;
    error: CommonError;
}

export interface P2POffersUpdate {
    type: typeof P2P_OFFERS_UPDATE;
    payload: Offer;
}

export interface P2PCurrenciesFetch {
    type: typeof P2P_CURRENCIES_FETCH;
}

export interface P2PCurrenciesData {
    type: typeof P2P_CURRENCIES_DATA;
    payload: P2PCurrency[];
}

export interface P2PCurrenciesError {
    type: typeof P2P_CURRENCIES_ERROR;
    error: CommonError;
}

export interface P2PPaymentMethodsFetch {
    type: typeof P2P_PAYMENT_METHODS_FETCH;
}

export interface P2PPaymentMethodsData {
    type: typeof P2P_PAYMENT_METHODS_DATA;
    payload: PaymentMethod[];
}

export interface P2PPaymentMethodsError {
    type: typeof P2P_PAYMENT_METHODS_ERROR;
    error: CommonError;
}

export interface P2PHighestPriceFetch {
    type: typeof P2P_HIGHEST_PRICE_FETCH;
    payload: {
        base: string;
        quote: string;
    };
}

export interface P2PHighestPriceData {
    type: typeof P2P_HIGHEST_PRICE_DATA;
    payload: string;
}

export interface P2PHighestPriceError {
    type: typeof P2P_HIGHEST_PRICE_ERROR;
    error: CommonError;
}

export type P2PActions =
    OffersFetch
    | OffersData
    | OffersError
    | P2PCurrenciesFetch
    | P2PCurrenciesData
    | P2PCurrenciesError
    | P2PPaymentMethodsFetch
    | P2PPaymentMethodsData
    | P2PPaymentMethodsError
    | P2POffersUpdate
    | P2PHighestPriceFetch
    | P2PHighestPriceData
    | P2PHighestPriceError;

export const offersFetch = (payload?: OffersFetch['payload']): OffersFetch => ({
    type: P2P_OFFERS_FETCH,
    payload,
});

export const offersData = (payload: OffersData['payload']): OffersData => ({
    type: P2P_OFFERS_DATA,
    payload,
});

export const offersError = (error: CommonError): OffersError => ({
    type: P2P_OFFERS_ERROR,
    error,
});

export const p2pOffersUpdate = (payload: P2POffersUpdate['payload']): P2POffersUpdate => ({
    type: P2P_OFFERS_UPDATE,
    payload,
});

export const p2pCurrenciesFetch = (): P2PCurrenciesFetch => ({
    type: P2P_CURRENCIES_FETCH,
});

export const p2pCurrenciesData = (payload: P2PCurrenciesData['payload']): P2PCurrenciesData => ({
    type: P2P_CURRENCIES_DATA,
    payload,
});

export const p2pCurrenciesError = (error: CommonError): P2PCurrenciesError => ({
    type: P2P_CURRENCIES_ERROR,
    error,
});

export const p2pPaymentMethodsFetch = (): P2PPaymentMethodsFetch => ({
    type: P2P_PAYMENT_METHODS_FETCH,
});

export const p2pPaymentMethodsData = (payload: P2PPaymentMethodsData['payload']): P2PPaymentMethodsData => ({
    type: P2P_PAYMENT_METHODS_DATA,
    payload,
});

export const p2pPaymentMethodsError = (error: CommonError): P2PPaymentMethodsError => ({
    type: P2P_PAYMENT_METHODS_ERROR,
    error,
});

export const p2pHighestPriceFetch = (payload: P2PHighestPriceFetch['payload']): P2PHighestPriceFetch => ({
    type: P2P_HIGHEST_PRICE_FETCH,
    payload,
});

export const p2pHighestPriceData = (payload: P2PHighestPriceData['payload']): P2PHighestPriceData => ({
    type: P2P_HIGHEST_PRICE_DATA,
    payload,
});

export const p2pHighestPriceError = (error: CommonError): P2PHighestPriceError => ({
    type: P2P_HIGHEST_PRICE_ERROR,
    error,
});

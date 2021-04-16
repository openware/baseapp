import { Offer } from 'src/modules';
import { CommonError } from '../../types';
import {
    P2P_CREATE_OFFER_DATA,
    P2P_CREATE_OFFER_ERROR,
    P2P_CREATE_OFFER_FETCH,
    P2P_ACTIVE_OFFERS_DATA,
    P2P_ACTIVE_OFFERS_ERROR,
    P2P_ACTIVE_OFFERS_FETCH,
    P2P_CANCELLED_OFFERS_DATA,
    P2P_CANCELLED_OFFERS_ERROR,
    P2P_CANCELLED_OFFERS_FETCH,
    P2P_CANCEL_OFFER_DATA,
    P2P_CANCEL_OFFER_ERROR,
    P2P_CANCEL_OFFER_FETCH,
} from './constants';

export interface ActiveOffersFetch {
    type: typeof P2P_ACTIVE_OFFERS_FETCH;
    payload: {
        page: number;
        limit: number;
    };
}

export interface ActiveOffersData {
    type: typeof P2P_ACTIVE_OFFERS_DATA;
    payload: {
        list: Offer[];
        page: number;
        total: number;  
    };
}

export interface ActiveOffersError {
    type: typeof P2P_ACTIVE_OFFERS_ERROR;
    error: CommonError;
}

export interface CancelledOffersFetch {
    type: typeof P2P_CANCELLED_OFFERS_FETCH;
    payload: {
        page: number;
        limit: number;
    };
}

export interface CancelledOffersData {
    type: typeof P2P_CANCELLED_OFFERS_DATA;
    payload: {
        list: Offer[];
        page: number;
        total: number;  
    };
}

export interface CancelledOffersError {
    type: typeof P2P_CANCELLED_OFFERS_ERROR;
    error: CommonError;
}

export interface CreateOfferFetch {
    type: typeof P2P_CREATE_OFFER_FETCH;
    payload: {
        base: string;
        quote: string;
        side: string;
        price: string | number;
        amount: string | number;
        min_order_amount: string | number;
        max_order_amount: string | number;
        upm_id: number[];
        time_limit: string | number;
        description?: string;
        reply_message?: string;
    };
}

export interface CreateOfferData {
    type: typeof P2P_CREATE_OFFER_DATA;
}

export interface CreateOfferError {
    type: typeof P2P_CREATE_OFFER_ERROR;
    error: CommonError;
}

export interface CancelOfferFetch {
    type: typeof P2P_CANCEL_OFFER_FETCH;
    payload: {
        id: number;
        list: Offer[];
    }
}

export interface CancelOfferData {
    type: typeof P2P_CANCEL_OFFER_DATA;
    payload: Offer[];
}

export interface CancelOfferError {
    type: typeof P2P_CANCEL_OFFER_ERROR;
    error: CommonError;
}

export type P2POffersActions =
    CancelledOffersFetch
    | CancelledOffersData
    | CancelledOffersError
    | ActiveOffersFetch
    | ActiveOffersData
    | ActiveOffersError
    | CreateOfferFetch
    | CreateOfferData
    | CreateOfferError
    | CancelOfferFetch
    | CancelOfferData
    | CancelOfferError;

export const activeOffersFetch = (payload?: ActiveOffersFetch['payload']): ActiveOffersFetch => ({
    type: P2P_ACTIVE_OFFERS_FETCH,
    payload,
});

export const activeOffersData = (payload: ActiveOffersData['payload']): ActiveOffersData => ({
    type: P2P_ACTIVE_OFFERS_DATA,
    payload,
});

export const activeOffersError = (error: CommonError): ActiveOffersError => ({
    type: P2P_ACTIVE_OFFERS_ERROR,
    error,
});

export const cancelledOffersFetch = (payload?: CancelledOffersFetch['payload']): CancelledOffersFetch => ({
    type: P2P_CANCELLED_OFFERS_FETCH,
    payload,
});

export const cancelledOffersData = (payload: CancelledOffersData['payload']): CancelledOffersData => ({
    type: P2P_CANCELLED_OFFERS_DATA,
    payload,
});

export const cancelledOffersError = (error: CommonError): CancelledOffersError => ({
    type: P2P_CANCELLED_OFFERS_ERROR,
    error,
});

export const createOffer = (payload: CreateOfferFetch['payload']): CreateOfferFetch => ({
    type: P2P_CREATE_OFFER_FETCH,
    payload,
});

export const createOfferData = (): CreateOfferData => ({
    type: P2P_CREATE_OFFER_DATA,
});

export const createOfferError = (error: CommonError): CreateOfferError => ({
    type: P2P_CREATE_OFFER_ERROR,
    error,
});

export const cancelOffer = (payload: CancelOfferFetch['payload']): CancelOfferFetch => ({
    type: P2P_CANCEL_OFFER_FETCH,
    payload,
});

export const cancelOfferData = (payload: CancelOfferData['payload']): CancelOfferData => ({
    type: P2P_CANCEL_OFFER_DATA,
    payload,
});

export const cancelOfferError = (error: CommonError): CancelOfferError => ({
    type: P2P_CANCEL_OFFER_ERROR,
    error,
});


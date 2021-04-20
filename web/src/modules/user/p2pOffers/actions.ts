import { Offer } from 'src/modules';
import { CommonError } from '../../types';
import {
    P2P_CREATE_OFFER_DATA,
    P2P_CREATE_OFFER_ERROR,
    P2P_CREATE_OFFER_FETCH,
    P2P_USER_OFFERS_DATA,
    P2P_USER_OFFERS_ERROR,
    P2P_USER_OFFERS_FETCH,
    P2P_USER_OFFERS_UPDATE,
    P2P_CANCEL_OFFER_DATA,
    P2P_CANCEL_OFFER_ERROR,
    P2P_CANCEL_OFFER_FETCH,
} from './constants';

export interface UserOffersFetch {
    type: typeof P2P_USER_OFFERS_FETCH;
    payload: {
        page: number;
        limit: number;
        state: string;
    };
}

export interface UserOffersData {
    type: typeof P2P_USER_OFFERS_DATA;
    payload: {
        list: Offer[];
        page: number;
        total: number;  
    };
}

export interface UserOffersError {
    type: typeof P2P_USER_OFFERS_ERROR;
    error: CommonError;
}

export interface P2PUserOffersUpdate {
    type: typeof P2P_USER_OFFERS_UPDATE;
    payload: Offer;
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
    | UserOffersFetch
    | UserOffersData
    | UserOffersError
    | CreateOfferFetch
    | CreateOfferData
    | CreateOfferError
    | CancelOfferFetch
    | CancelOfferData
    | CancelOfferError
    | P2PUserOffersUpdate;

export const userOffersFetch = (payload?: UserOffersFetch['payload']): UserOffersFetch => ({
    type: P2P_USER_OFFERS_FETCH,
    payload,
});

export const userOffersData = (payload: UserOffersData['payload']): UserOffersData => ({
    type: P2P_USER_OFFERS_DATA,
    payload,
});

export const userOffersError = (error: CommonError): UserOffersError => ({
    type: P2P_USER_OFFERS_ERROR,
    error,
});

export const p2pUserOffersUpdate = (payload: P2PUserOffersUpdate['payload']): P2PUserOffersUpdate => ({
    type: P2P_USER_OFFERS_UPDATE,
    payload,
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


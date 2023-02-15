import { CommonError } from '../../types';
import { CREATE_QUICK_ORDER_DATA, CREATE_QUICK_ORDER_ERROR, CREATE_QUICK_ORDER_FETCH } from './constants';

export interface CreateQuickExchangePayload {
    market: string;
    side: string;
    amount: string;
    price: string;
}

export interface CreateQuickExchangeFetch {
    type: typeof CREATE_QUICK_ORDER_FETCH;
    payload: CreateQuickExchangePayload;
}

export interface CreateQuickExchangeData {
    type: typeof CREATE_QUICK_ORDER_DATA;
}

export interface CreateQuickExchangeError {
    type: typeof CREATE_QUICK_ORDER_ERROR;
    error: CommonError;
}

export type CreateQuickExchangeActions = CreateQuickExchangeFetch | CreateQuickExchangeData | CreateQuickExchangeError;

export const createQuickExchangeFetch = (payload: CreateQuickExchangeFetch['payload']): CreateQuickExchangeFetch => ({
    type: CREATE_QUICK_ORDER_FETCH,
    payload,
});

export const createQuickExchangeData = (): CreateQuickExchangeData => ({
    type: CREATE_QUICK_ORDER_DATA,
});

export const createQuickExchangeError = (error: CommonError): CreateQuickExchangeError => ({
    type: CREATE_QUICK_ORDER_ERROR,
    error,
});

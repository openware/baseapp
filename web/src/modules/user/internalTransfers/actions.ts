import { CommonError } from '../../types';
import {
    CREATE_INTERNAL_TRANSFERS_DATA,
    CREATE_INTERNAL_TRANSFERS_ERROR,
    CREATE_INTERNAL_TRANSFERS_FETCH,
} from './constants';

export interface CreateInternalTranfertsPayload {
    username_or_uid: string;
    amount: string;
    currency: string;
    otp: string;
}

export interface CreateInternalTransfersFetch {
    type: typeof CREATE_INTERNAL_TRANSFERS_FETCH;
    payload: CreateInternalTranfertsPayload;
}

export interface CreateInternalTransfersData {
    type: typeof CREATE_INTERNAL_TRANSFERS_DATA;
}

export interface CreateInternalTransfersError {
    type: typeof CREATE_INTERNAL_TRANSFERS_ERROR;
    error: CommonError;
}

export type CreateInternalTransfersActions =
    | CreateInternalTransfersFetch
    | CreateInternalTransfersData
    | CreateInternalTransfersError;

export const createInternalTransfersFetch = (
    payload: CreateInternalTransfersFetch['payload'],
): CreateInternalTransfersFetch => ({
    type: CREATE_INTERNAL_TRANSFERS_FETCH,
    payload,
});

export const createInternalTransfersData = (): CreateInternalTransfersData => ({
    type: CREATE_INTERNAL_TRANSFERS_DATA,
});

export const createInternalTransfersError = (error: CommonError): CreateInternalTransfersError => ({
    type: CREATE_INTERNAL_TRANSFERS_ERROR,
    error,
});

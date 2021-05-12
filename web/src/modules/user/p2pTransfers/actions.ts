import { CommonError } from '../../types';
import {
    CREATE_P2P_TRANSFERS_DATA,
    CREATE_P2P_TRANSFERS_ERROR,
    CREATE_P2P_TRANSFERS_FETCH,
} from './constants';

export interface CreateP2PTranfersPayload {
    amount: string;
    currency: string;
    from: string;
    to: string;
}

export interface CreateP2PTransfersFetch {
    type: typeof CREATE_P2P_TRANSFERS_FETCH;
    payload: CreateP2PTranfersPayload;
}

export interface CreateP2PTransfersData {
    type: typeof CREATE_P2P_TRANSFERS_DATA;
}

export interface CreateP2PTransfersError {
    type: typeof CREATE_P2P_TRANSFERS_ERROR;
    error: CommonError;
}

export type CreateP2PTransfersActions =
    CreateP2PTransfersFetch
    | CreateP2PTransfersData
    | CreateP2PTransfersError;

export const createP2PTransfersFetch = (payload: CreateP2PTransfersFetch['payload']): CreateP2PTransfersFetch => ({
    type: CREATE_P2P_TRANSFERS_FETCH,
    payload,
});

export const createP2PTransfersData = (): CreateP2PTransfersData => ({
    type: CREATE_P2P_TRANSFERS_DATA,
});

export const createP2PTransfersError = (error: CommonError): CreateP2PTransfersError => ({
    type: CREATE_P2P_TRANSFERS_ERROR,
    error,
});

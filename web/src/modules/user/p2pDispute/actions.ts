import { CommonError } from '../../types';
import { P2P_DISPUTE_DATA, P2P_DISPUTE_ERROR, P2P_DISPUTE_FETCH } from './constants';

export interface P2PDisputeFetch {
    type: typeof P2P_DISPUTE_FETCH;
    payload: FormData;
}

export interface P2PDisputeData {
    type: typeof P2P_DISPUTE_DATA;
}

export interface P2PDisputeError {
    type: typeof P2P_DISPUTE_ERROR;
    error: CommonError;
}

export type P2PDisputeActions = P2PDisputeFetch | P2PDisputeData | P2PDisputeError;

export const p2pDisputeFetch = (payload: P2PDisputeFetch['payload']): P2PDisputeFetch => ({
    type: P2P_DISPUTE_FETCH,
    payload,
});

export const p2pDisputeData = (): P2PDisputeData => ({
    type: P2P_DISPUTE_DATA,
});

export const p2pDisputeError = (error: CommonError): P2PDisputeError => ({
    type: P2P_DISPUTE_ERROR,
    error,
});

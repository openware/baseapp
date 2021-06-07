import { CommonError } from '../../types';
import { FEE_GROUP_DATA, FEE_GROUP_ERROR, FEE_GROUP_FETCH } from './constants';
import { FeeGroup } from './types';

export interface FeeGroupFetch {
    type: typeof FEE_GROUP_FETCH;
}

export interface FeeGroupData {
    type: typeof FEE_GROUP_DATA;
    payload: FeeGroup;
}

export interface FeeGroupError {
    type: typeof FEE_GROUP_ERROR;
    error: CommonError;
}

export type FeeGroupAction = FeeGroupFetch
    | FeeGroupData
    | FeeGroupError;

export const feeGroupFetch = (): FeeGroupFetch => ({
    type: FEE_GROUP_FETCH,
});

export const feeGroupData = (payload: FeeGroupData['payload']): FeeGroupData => ({
    type: FEE_GROUP_DATA,
    payload,
});

export const feeGroupError = (error: CommonError): FeeGroupError => ({
    type: FEE_GROUP_ERROR,
    error,
});

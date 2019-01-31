import { CommonError } from '../../types';
import {
    DEPOSITS_DATA,
    DEPOSITS_ERROR,
    DEPOSITS_FETCH,
} from './constants';
import { Deposit } from './reducer';

export interface DepositsFetch {
    type: typeof DEPOSITS_FETCH;
}

export interface DepositsData {
    type: typeof DEPOSITS_DATA;
    payload: Deposit[];
}

export interface DepositsError {
    type: typeof DEPOSITS_ERROR;
    payload: CommonError;
}

export type DepositsActions = DepositsFetch | DepositsData | DepositsError;

export const depositsFetch = (): DepositsFetch => ({
    type: DEPOSITS_FETCH,
});

export const depositsData = (payload: DepositsData['payload']): DepositsData => ({
    type: DEPOSITS_DATA,
    payload,
});

export const depositsError = (payload: DepositsError['payload']): DepositsError => ({
    type: DEPOSITS_ERROR,
    payload,
});

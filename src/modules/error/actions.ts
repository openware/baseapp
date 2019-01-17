import { ERROR_DATA } from './constants';

export interface ErrorData {
    type: typeof ERROR_DATA;
    payload: number;
}

export type ErrorAction = ErrorData;

export const handleError = (payload: ErrorData['payload']): ErrorData => ({
    type: ERROR_DATA,
    payload,
});

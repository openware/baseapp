import { CommonError } from '../../types';
import {
    DELETE_ERROR,
    DELETE_ERROR_BY_INDEX,
    DELETE_SUCCESS,
    DELETE_SUCCESS_BY_INDEX,
    ERROR_DATA, ERROR_FETCH,
    SUCCESS_DATA,
    SUCCESS_FETCH,
} from './constants';

export interface ErrorFecth {
    type: typeof ERROR_FETCH;
    error: CommonError;
}

export interface ErrorData {
    type: typeof ERROR_DATA;
    error: CommonError;
}

export interface DeleteError {
    type: typeof DELETE_ERROR;
}

export interface DeleteErrorByIndex {
    type: typeof DELETE_ERROR_BY_INDEX;
    index: number;
}

export interface SuccessFecth {
    type: typeof SUCCESS_FETCH;
    success: string;
}

export interface SuccessData {
    type: typeof SUCCESS_DATA;
    success: string;
}

export interface DeleteSuccess {
    type: typeof DELETE_SUCCESS;
}

export interface DeleteSuccessByIndex {
    type: typeof DELETE_SUCCESS_BY_INDEX;
    index: number;
}

export type AlertAction = ErrorData
    | DeleteError
    | DeleteErrorByIndex
    | ErrorFecth
    | SuccessData
    | DeleteSuccess
    | DeleteSuccessByIndex
    | SuccessFecth;

export const fetchError = (error: CommonError): ErrorFecth => ({
    type: ERROR_FETCH,
    error,
});

export const handleError = (error: CommonError): ErrorData => ({
    type: ERROR_DATA,
    error,
});

export const deleteError = (): DeleteError => ({
    type: DELETE_ERROR,
});

export const deleteErrorByIndex = (index: number): DeleteErrorByIndex => ({
    type: DELETE_ERROR_BY_INDEX,
    index,
});

export const fetchSuccess = (success: string): SuccessFecth => ({
    type: SUCCESS_FETCH,
    success,
});

export const handleSuccess = (success: string): SuccessData => ({
    type: SUCCESS_DATA,
    success,
});

export const deleteSuccess = (): DeleteSuccess => ({
    type: DELETE_SUCCESS,
});

export const deleteSuccessByIndex = (index: number): DeleteSuccessByIndex => ({
    type: DELETE_SUCCESS_BY_INDEX,
    index,
});

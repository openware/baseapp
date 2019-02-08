import { CommonError } from '../types';
import {  DELETE_ERROR, DELETE_ERROR_BY_INDEX, ERROR_DATA, ERROR_FETCH } from './constants';

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

export type ErrorAction = ErrorData
    | DeleteError
    | DeleteErrorByIndex
    | ErrorFecth;

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

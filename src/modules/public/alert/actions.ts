import { CommonError } from '../../types';
import {
    ALERT_DELETE_ERROR,
    ALERT_DELETE_ERROR_BY_INDEX,
    ALERT_DELETE_SUCCESS,
    ALERT_DELETE_SUCCESS_BY_INDEX,
    ALERT_ERROR_DATA, ALERT_ERROR_PUSH,
    ALERT_SUCCESS_DATA,
    ALERT_SUCCESS_PUSH,
} from './constants';

export interface ErrorFecth {
    type: typeof ALERT_ERROR_PUSH;
    error: CommonError;
}

export interface ErrorData {
    type: typeof ALERT_ERROR_DATA;
    error: CommonError;
}

export interface DeleteError {
    type: typeof ALERT_DELETE_ERROR;
}

export interface DeleteErrorByIndex {
    type: typeof ALERT_DELETE_ERROR_BY_INDEX;
    index: number;
}

export interface SuccessFecth {
    type: typeof ALERT_SUCCESS_PUSH;
    success: string;
}

export interface SuccessData {
    type: typeof ALERT_SUCCESS_DATA;
    success: string;
}

export interface DeleteSuccess {
    type: typeof ALERT_DELETE_SUCCESS;
}

export interface DeleteSuccessByIndex {
    type: typeof ALERT_DELETE_SUCCESS_BY_INDEX;
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

export const pushAlertError = (error: CommonError): ErrorFecth => ({
    type: ALERT_ERROR_PUSH,
    error,
});

export const handleError = (error: CommonError): ErrorData => ({
    type: ALERT_ERROR_DATA,
    error,
});

export const deleteError = (): DeleteError => ({
    type: ALERT_DELETE_ERROR,
});

export const deleteErrorByIndex = (index: number): DeleteErrorByIndex => ({
    type: ALERT_DELETE_ERROR_BY_INDEX,
    index,
});

export const pushAlertSuccess = (success: string): SuccessFecth => ({
    type: ALERT_SUCCESS_PUSH,
    success,
});

export const handleSuccess = (success: string): SuccessData => ({
    type: ALERT_SUCCESS_DATA,
    success,
});

export const deleteSuccess = (): DeleteSuccess => ({
    type: ALERT_DELETE_SUCCESS,
});

export const deleteSuccessByIndex = (index: number): DeleteSuccessByIndex => ({
    type: ALERT_DELETE_SUCCESS_BY_INDEX,
    index,
});

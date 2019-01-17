import { CommonError } from '../../types';
import { DocumentsAction } from './actions';
import {
    SEND_DOCUMENTS_DATA,
    SEND_DOCUMENTS_ERROR,
    SEND_DOCUMENTS_FETCH,
} from './constants';

export interface DocumentsState {
    success?: string;
    error?: CommonError;
}

const initialState: DocumentsState = {};

export const documentsReducer = (state = initialState, action: DocumentsAction) => {
    switch (action.type) {
        case SEND_DOCUMENTS_FETCH:
            return {
                ...state,
                success: undefined,
                error: undefined,
            };
        case SEND_DOCUMENTS_DATA:
            return {
                ...state,
                success: action.payload.message,
                error: undefined,
            };
        case SEND_DOCUMENTS_ERROR:
            return {
                success: undefined,
                error: action.payload,
            };
        default:
            return state;
    }
};

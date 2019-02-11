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
    loading: boolean;
}

export const initialDocumentsState: DocumentsState = { loading: false };

export const documentsReducer = (state = initialDocumentsState, action: DocumentsAction) => {
    switch (action.type) {
        case SEND_DOCUMENTS_FETCH:
            return {
                ...state,
                success: undefined,
                error: undefined,
                loading: true,
            };
        case SEND_DOCUMENTS_DATA:
            return {
                ...state,
                success: action.payload.message,
                error: undefined,
                loading: false,
            };
        case SEND_DOCUMENTS_ERROR:
            return {
                success: undefined,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

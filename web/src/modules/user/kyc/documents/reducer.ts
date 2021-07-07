import { CommonError } from '../../../types';
import { DocumentsAction } from './actions';
import { SEND_DOCUMENTS_DATA, SEND_DOCUMENTS_ERROR, SEND_DOCUMENTS_FETCH } from './constants';

export interface DocumentsState {
    success: boolean;
    error?: CommonError;
    loading: boolean;
}

export const initialDocumentsState: DocumentsState = { loading: false, success: false };

export const documentsReducer = (state = initialDocumentsState, action: DocumentsAction) => {
    switch (action.type) {
        case SEND_DOCUMENTS_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
                loading: true,
            };
        case SEND_DOCUMENTS_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
                loading: false,
            };
        case SEND_DOCUMENTS_ERROR:
            return {
                success: false,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
};

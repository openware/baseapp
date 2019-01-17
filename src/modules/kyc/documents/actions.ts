import { CommonError } from '../../types';
import {
    SEND_DOCUMENTS_DATA,
    SEND_DOCUMENTS_ERROR,
    SEND_DOCUMENTS_FETCH,
} from './constants';

export interface SendDocumentsFetch {
    type: typeof SEND_DOCUMENTS_FETCH;
    payload: FormData;
}

export interface SendDocumentsData {
    type: typeof SEND_DOCUMENTS_DATA;
    payload: {
        message: string;
    };
}

export interface SendDocumentsError {
    type: typeof SEND_DOCUMENTS_ERROR;
    payload: CommonError;
}

export type DocumentsAction = SendDocumentsFetch
    | SendDocumentsData
    | SendDocumentsError;

export const sendDocuments = (payload: SendDocumentsFetch['payload']): SendDocumentsFetch => ({
    type: SEND_DOCUMENTS_FETCH,
    payload,
});

export const sendDocumentsData = (payload: SendDocumentsData['payload']): SendDocumentsData => ({
    type: SEND_DOCUMENTS_DATA,
    payload,
});

export const sendDocumentsError = (payload: SendDocumentsError['payload']): SendDocumentsError => ({
    type: SEND_DOCUMENTS_ERROR,
    payload,
});

import { CommonError } from '../../../types';
import { SEND_DOCUMENTS_DATA, SEND_DOCUMENTS_ERROR, SEND_DOCUMENTS_FETCH } from './constants';

export interface SendDocumentsFetch {
    type: typeof SEND_DOCUMENTS_FETCH;
    payload: {
        front_side: FormData;
        back_side?: FormData;
        selfie: FormData;
    };
}

export interface SendDocumentsData {
    type: typeof SEND_DOCUMENTS_DATA;
}

export interface SendDocumentsError {
    type: typeof SEND_DOCUMENTS_ERROR;
    error: CommonError;
}

export type DocumentsAction = SendDocumentsFetch
    | SendDocumentsData
    | SendDocumentsError;

export const sendDocuments = (payload: SendDocumentsFetch['payload']): SendDocumentsFetch => ({
    type: SEND_DOCUMENTS_FETCH,
    payload,
});

export const sendDocumentsData = (): SendDocumentsData => ({
    type: SEND_DOCUMENTS_DATA,
});

export const sendDocumentsError = (error: CommonError): SendDocumentsError => ({
    type: SEND_DOCUMENTS_ERROR,
    error,
});

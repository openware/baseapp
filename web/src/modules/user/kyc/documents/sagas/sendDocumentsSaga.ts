import { all, call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { sendDocumentsData, sendDocumentsError, SendDocumentsFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendDocumentsSaga(action: SendDocumentsFetch) {
    try {
        const { front_side, back_side, selfie } = action.payload;
        yield all([
            call(sendDocumentItem, front_side),
            back_side && call(sendDocumentItem, back_side),
            call(sendDocumentItem, selfie)
        ]);

        yield put(sendDocumentsData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: sendDocumentsError,
            },
        }));
    }
}

export function* sendDocumentItem(payload: FormData) {
    yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/documents', payload);
    yield put(alertPush({ message: ['success.documents.accepted'], type: 'success'}));
}

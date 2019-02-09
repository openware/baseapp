// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError, fetchSuccess } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { sendDocumentsData, sendDocumentsError, SendDocumentsFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* sendDocumentsSaga(action: SendDocumentsFetch) {
    try {
        const response = yield call(API.post(sessionsConfig), '/resource/documents', action.payload);
        const defaultMessage = 'Your documents are successfully accepted';
        const { message = defaultMessage } = response;
        yield put(sendDocumentsData({ message }));
        yield put(fetchSuccess(defaultMessage));
    } catch (error) {
        yield put(sendDocumentsError(error));
        yield put(fetchError(error));
    }
}

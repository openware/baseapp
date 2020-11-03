import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { SEND_DOCUMENTS_FETCH } from '../constants';
import { sendDocumentsSaga } from './sendDocumentsSaga';

export function* rootSendDocumentsSaga(): SagaIterator {
    yield takeEvery(SEND_DOCUMENTS_FETCH, sendDocumentsSaga);
}

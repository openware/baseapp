import { takeEvery } from 'redux-saga/effects';

import { SEND_DOCUMENTS_FETCH } from '../constants';
import { sendDocumentsSaga } from './sendDocumentsSaga';

export function* rootSendDocumentsSaga() {
    yield takeEvery(SEND_DOCUMENTS_FETCH, sendDocumentsSaga);
}

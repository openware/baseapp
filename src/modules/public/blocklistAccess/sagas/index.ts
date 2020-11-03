import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { SEND_BLOCKLIST_ACCESS_TOKEN_FETCH } from '../constants';
import { blocklistAccessFetchSaga } from './blocklistAccessFetchSaga';

export function* rootBlocklistAccessSaga(): SagaIterator {
    yield takeEvery(SEND_BLOCKLIST_ACCESS_TOKEN_FETCH, blocklistAccessFetchSaga);
}

import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { SEND_ADDRESSES_FETCH } from '../constants';
import { sendAddressesSaga } from './sendAddressesSaga';

export function* rootSendAddressesSaga(): SagaIterator {
    yield takeEvery(SEND_ADDRESSES_FETCH, sendAddressesSaga);
}

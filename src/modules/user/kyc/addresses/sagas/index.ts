import { takeEvery } from 'redux-saga/effects';

import { SEND_ADDRESSES_FETCH } from '../constants';
import { sendAddressesSaga } from './sendAddressesSaga';

export function* rootSendAddressesSaga() {
    yield takeEvery(SEND_ADDRESSES_FETCH, sendAddressesSaga);
}

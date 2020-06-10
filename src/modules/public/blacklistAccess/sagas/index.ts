// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { SEND_ACCESS_TOKEN_FETCH } from '../constants';
import { blacklistAccessFetchSaga } from './blacklistAccessFetchSaga';

export function* rootBlacklistAccessSaga() {
    yield takeEvery(SEND_ACCESS_TOKEN_FETCH, blacklistAccessFetchSaga);
}

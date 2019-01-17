// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { WITHDRAWS_FETCH } from '../constants';
import { withdrawsFetchSaga } from './withdrawFetchSaga';

export function* rootWithdrawSaga() {
    yield takeLatest(WITHDRAWS_FETCH, withdrawsFetchSaga);
}

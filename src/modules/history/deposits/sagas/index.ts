// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { DEPOSITS_FETCH } from '../constants';
import { depositFetchSaga } from './depositFetchSaga';

export function* rootDepositSaga() {
    yield takeLatest(DEPOSITS_FETCH, depositFetchSaga);
}

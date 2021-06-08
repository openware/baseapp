import { takeLatest } from 'redux-saga/effects';
import { WITHDRAW_LIMITS_FETCH } from '../constants';
import { withdrawLimitsSaga } from './withdrawLimitsSaga';

export function* rootWithdrawLimitsSaga() {
    yield takeLatest(WITHDRAW_LIMITS_FETCH, withdrawLimitsSaga);
}

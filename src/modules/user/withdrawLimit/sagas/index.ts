// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    WITHDRAW_LIMIT_FETCH,
} from '../constants';
import { withdrawLimitSaga } from './withdrawLimitSaga';

export function* rootWithdrawLimitSaga() {
    yield takeEvery(WITHDRAW_LIMIT_FETCH, withdrawLimitSaga);
}

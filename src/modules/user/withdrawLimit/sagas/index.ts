import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { WITHDRAW_LIMIT_FETCH } from '../constants';
import { withdrawLimitSaga } from './withdrawLimitSaga';

export function* rootWithdrawLimitSaga(): SagaIterator {
    yield takeLatest(WITHDRAW_LIMIT_FETCH, withdrawLimitSaga);
}

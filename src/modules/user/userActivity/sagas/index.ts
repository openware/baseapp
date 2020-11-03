import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { USER_ACTIVITY_FETCH } from '../constants';
import { userActivitySaga } from './userActivitySaga';

export function* rootUserActivitySaga(): SagaIterator {
    yield takeLatest(USER_ACTIVITY_FETCH, userActivitySaga);
}

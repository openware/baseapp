// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    USER_ACTIVITY_FETCH,
} from '../constants';
import { userActivitySaga } from './userActivitySaga';

export function* rootUserActivitySaga() {
    yield takeEvery(USER_ACTIVITY_FETCH, userActivitySaga);
}

// tslint:disable
import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { userReset } from '../../';
import { deleteError, ErrorData, handleError } from '../actions';

export function* handleErrorSaga(action: ErrorData) {
    if (action.error.message === 'Invalid Session') {
        yield put(userReset());
        return;
    } else if (action.error.code === 403) {
        return;
    } else {
        yield put(handleError(action.error));
    }
    yield delay(5000)
    yield put(deleteError())
}

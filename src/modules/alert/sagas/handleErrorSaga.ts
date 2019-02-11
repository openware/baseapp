import { delay } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { put } from 'redux-saga/effects';
import { userReset } from '../../';
import { deleteError, ErrorData, handleError } from '../actions';

export function* handleErrorSaga(action: ErrorData) {
    switch (action.error.code) {
        case 401:
            yield put(userReset());
            return;

        case 403:
            return;

        default:
            yield put(handleError(action.error));
            yield delay(5000);
            yield put(deleteError());
    }
}

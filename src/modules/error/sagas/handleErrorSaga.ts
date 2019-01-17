// tslint:disable-next-line
import { put } from 'redux-saga/effects';
import { userReset } from '../../';
import { ErrorData } from '../actions';

export function* handleErrorSaga(action: ErrorData) {
    switch (action.payload) {
        case 401:
            yield put(userReset()); return;
        default:
            // tslint:disable-next-line:no-console
            console.log(action.payload);
    }
}

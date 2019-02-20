import { delay } from 'redux-saga';
// tslint:disable-next-line
import { put, takeEvery } from 'redux-saga/effects';
import { msAlertDisplayTime } from '../../../../api';
import { userReset } from '../../../user/profile';
import { deleteError, deleteSuccess, ErrorData, handleError, handleSuccess, SuccessData } from '../actions';
import { ALERT_ERROR_PUSH, ALERT_SUCCESS_PUSH } from '../constants';

export function* handleSuccessSaga(action: SuccessData) {
    yield put(handleSuccess(action.success));
    yield delay(Number(msAlertDisplayTime()));
    yield put(deleteSuccess());
}

export function* handleErrorSaga(action: ErrorData) {
    switch (action.error.code) {
        case 401:
            if (action.error.message[0] === 'identity.session.not_active') {
                yield put(userReset());
                yield put(handleError(action.error));
            } else {
                yield put(handleError(action.error));
            }
            break;

        case 403:
            // TODO: What is this case we are ignoring?
            return;

        default:
            yield put(handleError(action.error));
    }
    yield delay(Number(msAlertDisplayTime()));
    yield put(deleteError());
}

export function* rootHandleAlertSaga() {
    yield takeEvery(ALERT_ERROR_PUSH, handleErrorSaga);
    yield takeEvery(ALERT_SUCCESS_PUSH, handleSuccessSaga);
}

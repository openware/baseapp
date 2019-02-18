import { delay } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { put } from 'redux-saga/effects';
import { deleteSuccess, handleSuccess, SuccessData } from '../actions';

export function* handleSuccessSaga(action: SuccessData) {
    yield put(handleSuccess(action.success));
    yield delay(5000);
    yield put(deleteSuccess());
}

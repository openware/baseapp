// tslint:disable
import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { deleteSuccess, SuccessData, handleSuccess } from '../actions';

export function* handleSuccessSaga(action: SuccessData) {
    yield put(handleSuccess(action.success))
    yield delay(5000)
    yield put(deleteSuccess())
}

// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { ERROR_DATA } from '../constants';
import { handleErrorSaga } from './handleErrorSaga';

export function* rootHandleErrorSaga() {
    yield takeEvery(ERROR_DATA, handleErrorSaga);
}

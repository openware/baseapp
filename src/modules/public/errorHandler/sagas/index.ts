import { takeEvery } from 'redux-saga/effects';

import { ERROR_HANDLE_FETCH } from '../constants';
import { handleErrorSaga } from './handleErrorSaga';

export function* rootErrorHandlerSaga() {
    yield takeEvery(ERROR_HANDLE_FETCH, handleErrorSaga);
}

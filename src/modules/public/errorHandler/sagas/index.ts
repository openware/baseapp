import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { ERROR_HANDLE_FETCH } from '../constants';
import { handleErrorSaga } from './handleErrorSaga';

export function* rootErrorHandlerSaga(): SagaIterator {
    yield takeEvery(ERROR_HANDLE_FETCH, handleErrorSaga);
}

import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { ALERT_PUSH } from '../constants';
import { handleAlertSaga } from './handleAlertSaga';

export function* rootHandleAlertSaga(): SagaIterator {
    yield takeEvery(ALERT_PUSH, handleAlertSaga);
}

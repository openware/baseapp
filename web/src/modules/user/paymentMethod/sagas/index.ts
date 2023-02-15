import { takeEvery } from 'redux-saga/effects';
import {
    PAYMENT_METHOD_CREATE_FETCH,
    PAYMENT_METHOD_DELETE_FETCH,
    PAYMENT_METHOD_LIST_FETCH,
    PAYMENT_METHOD_UPDATE_FETCH,
} from '../constants';

import { paymentMethodCreateSaga } from './paymentMethodCreateSaga';
import { paymentMethodDeleteSaga } from './paymentMethodDeleteSaga';
import { paymentMethodListSaga } from './paymentMethodListSaga';
import { paymentMethodUpdateSaga } from './paymentMethodUpdateSaga';

export function* rootPaymentMethodSaga() {
    yield takeEvery(PAYMENT_METHOD_LIST_FETCH, paymentMethodListSaga);
    yield takeEvery(PAYMENT_METHOD_CREATE_FETCH, paymentMethodCreateSaga);
    yield takeEvery(PAYMENT_METHOD_UPDATE_FETCH, paymentMethodUpdateSaga);
    yield takeEvery(PAYMENT_METHOD_DELETE_FETCH, paymentMethodDeleteSaga);
}

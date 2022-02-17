import { takeEvery } from 'redux-saga/effects';
import {
    PAYMENT_METHOD_LIST_FETCH,
    PAYMENT_METHOD_CREATE_FETCH,
    PAYMENT_METHOD_UPDATE_FETCH,
    PAYMENT_METHOD_DELETE_FETCH
} from '../constants';

import { paymentMethodListSaga } from './paymentMethodListSaga';
import { paymentMethodCreateSaga } from './paymentMethodCreateSaga';
import { paymentMethodUpdateSaga } from './paymentMethodUpdateSaga';
import { paymentMethodDeleteSaga } from './paymentMethodDeleteSaga';

export function* rootPaymentMethodSaga() {
    yield takeEvery(PAYMENT_METHOD_LIST_FETCH, paymentMethodListSaga);
    yield takeEvery(PAYMENT_METHOD_CREATE_FETCH, paymentMethodCreateSaga);
    yield takeEvery(PAYMENT_METHOD_UPDATE_FETCH, paymentMethodUpdateSaga);
    yield takeEvery(PAYMENT_METHOD_DELETE_FETCH, paymentMethodDeleteSaga);
}

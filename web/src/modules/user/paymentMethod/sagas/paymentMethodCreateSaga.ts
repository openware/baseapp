import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    paymentMethodCreate,
    PaymentMethodCreateFetch,
    paymentMethodModal,
    paymentMethodError,
} from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* paymentMethodCreateSaga(action: PaymentMethodCreateFetch) {
    try {
        yield call(API.post(createOptions(getCsrfToken())), '/private/payment_methods', action.payload);
        yield put(paymentMethodCreate());
        yield put(alertPush({ message: ['success.payment_method.created'], type: 'success' }));
        yield put(paymentMethodModal({ active: false }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: paymentMethodError,
            },
        }));
    }
}

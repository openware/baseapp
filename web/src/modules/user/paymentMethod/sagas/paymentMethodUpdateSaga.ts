import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { paymentMethodError, paymentMethodModal, paymentMethodUpdate, PaymentMethodUpdateFetch } from '../actions';

const updateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* paymentMethodUpdateSaga(action: PaymentMethodUpdateFetch) {
    try {
        const { id } = action.payload;
        yield call(API.put(updateOptions(getCsrfToken())), `/private/payment_methods/${id}`, action.payload);
        yield put(paymentMethodUpdate());
        yield put(alertPush({ message: ['success.payment_method.updated'], type: 'success' }));
        yield put(paymentMethodModal({ active: false }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: paymentMethodError,
                },
            }),
        );
    }
}

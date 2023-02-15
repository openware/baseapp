import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { paymentMethodError, paymentMethodList, PaymentMethodListFetch } from '../actions';

const options: RequestOptions = {
    apiVersion: 'p2p',
};

export function* paymentMethodListSaga(action: PaymentMethodListFetch) {
    try {
        const data = yield call(API.get(options), '/private/payment_methods');
        yield put(paymentMethodList(data));
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

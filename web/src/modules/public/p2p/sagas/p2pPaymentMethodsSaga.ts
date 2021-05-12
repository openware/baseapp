import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPaymentMethodsData, p2pPaymentMethodsError } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pPaymentMethodsSaga() {
    try {
        const data = yield call(API.get(config), '/public/payment_methods');
        yield put(p2pPaymentMethodsData(data));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pPaymentMethodsError,
            },
        }));
    }
}

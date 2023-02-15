import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { createQuickExchangeData, createQuickExchangeError, CreateQuickExchangeFetch } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'finex',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createQuickExchangeOrderSaga(action: CreateQuickExchangeFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), '/qe/orders', action.payload);
        yield put(createQuickExchangeData());
        yield put(alertPush({ message: ['success.quick.exchange.order.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: createQuickExchangeError,
                },
            }),
        );
    }
}

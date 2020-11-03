import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { openOrdersCancelError, OpenOrdersCancelFetch } from '../actions';

const ordersCancelOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: getOrderAPI(),
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* openOrdersCancelSaga(action: OpenOrdersCancelFetch): SagaIterator {
    try {
        const {
            order: { id, uuid },
        } = action.payload;

        if (isFinexEnabled()) {
            if (uuid) {
                yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/cancel/${uuid}`, { uuid });
            } else {
                yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/cancel/${id}`, { id });
            }
        } else {
            if (uuid) {
                yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/${uuid}/cancel`, { uuid });
            } else {
                yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/${id}/cancel`, { id });
            }
        }

        yield put(alertPush({ message: ['success.order.cancelling'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: openOrdersCancelError,
                },
            })
        );
    }
}

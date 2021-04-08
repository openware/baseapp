import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pOrdersCancelData, p2pOrdersCancelError, P2POrdersCancelFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* cancelOrderSaga(action: P2POrdersCancelFetch) {
    try {
        yield call(API.post(executeOptions(getCsrfToken())), `/private/orders/${action.payload.id}/cancel`);
        yield put(p2pOrdersCancelData());
        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pOrdersCancelError,
            },
        }));
    }
}

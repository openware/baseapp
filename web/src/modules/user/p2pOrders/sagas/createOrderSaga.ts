import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pOrdersAppend, p2pOrdersCreateData, p2pOrdersCreateError, P2POrdersCreateFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createOrderSaga(action: P2POrdersCreateFetch) {
    try {
        const order = yield call(API.post(executeOptions(getCsrfToken())), '/private/orders', action.payload);
        yield put(p2pOrdersCreateData(order));
        yield put(p2pOrdersAppend(order));
        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pOrdersCreateError,
            },
        }));
    }
}

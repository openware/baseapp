import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pOrdersCreateData, p2pOrdersUpdateData, p2pOrdersUpdateError, P2POrdersUpdateFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateOrderSaga(action: P2POrdersUpdateFetch) {
    try {
        const { id } = action.payload;
        const data = yield call(API.post(executeOptions(getCsrfToken())), `/private/orders/${id}/${action.payload.action}`);
        yield put(p2pOrdersUpdateData());
        yield put(p2pOrdersCreateData(data));
        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pOrdersUpdateError,
            },
        }));
    }
}

import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pOrdersUpdateData, p2pOrdersUpdateError, P2POrdersUpdateFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateOrderSaga(actionParam: P2POrdersUpdateFetch) {
    try {
        const { action, id, payment_method_id } = actionParam.payload;
        const data = yield call(API.post(executeOptions(getCsrfToken())), `/private/orders/${id}/${action}`, {
            payment_method_id,
        });
        yield put(p2pOrdersUpdateData(data));
        yield put(alertPush({ message: [`success.order.${action}`], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOrdersUpdateError,
                },
            }),
        );
    }
}

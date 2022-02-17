import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pOrderData, p2pOrderError, P2POrderFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* getOrderSaga(action: P2POrderFetch) {
    try {
        const data = yield call(API.get(config), `/private/orders/${action.payload.id}`);

        yield put(p2pOrderData(data));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pOrderError,
            },
        }));
    }
}

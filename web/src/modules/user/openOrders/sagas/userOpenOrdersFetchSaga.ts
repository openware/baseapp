import { call, put } from 'redux-saga/effects';
import { buildQueryString, getOrderAPI } from 'src/helpers';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userOpenOrdersData, userOpenOrdersError, UserOpenOrdersFetch } from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: getOrderAPI(),
};

export function* userOpenOrdersFetchSaga(action: UserOpenOrdersFetch) {
    try {
        let payload: any = { state: ['wait', 'trigger_wait'] };
        if (action.payload) {
            payload = { ...payload, market: action.payload.market.id };
        }

        const list = yield call(API.get(ordersOptions), `/market/orders?${buildQueryString(payload)}`);
        yield put(userOpenOrdersData(list));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOpenOrdersError,
            },
        }));
    }
}

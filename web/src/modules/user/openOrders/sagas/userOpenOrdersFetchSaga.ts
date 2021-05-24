import { call, put } from 'redux-saga/effects';
import { getOrderAPI } from 'src/helpers';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userOpenOrdersData, userOpenOrdersError, UserOpenOrdersFetch } from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: getOrderAPI(),
};

export function* userOpenOrdersFetchSaga(action: UserOpenOrdersFetch) {
    try {
        const { market } = action.payload;
        const list = yield call(API.get(ordersOptions), `/market/orders?market=${market.id}&state=wait`);

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

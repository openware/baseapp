import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderBookData, orderBookError, OrderBookFetch } from '../actions';

const orderBookOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* orderBookSaga(action: OrderBookFetch): SagaIterator {
    try {
        const market = action.payload;
        if (!market.id) {
            throw new Error(`ERROR: Empty market provided to orderBookSaga`);
        }

        const orderBook = yield call(API.get(orderBookOptions), `/public/markets/${market.id}/order-book`);
        yield put(orderBookData(orderBook));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'console',
                extraOptions: {
                    actionError: orderBookError,
                },
            })
        );
    }
}

import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { marketPriceData, marketPriceError, MarketPriceFetch } from '../actions';

const marketPriceRequestOptions: RequestOptions = {
    apiVersion: 'finex',
};

export function* marketPriceSaga(action: MarketPriceFetch) {
    try {
        const payload = action.payload ? `?${buildQueryString(action.payload)}` : '';
        const price = yield call(API.get(marketPriceRequestOptions), `/public/qe/prices${payload}`);
        yield put(marketPriceData(price));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: marketPriceError,
                },
            }),
        );
    }
}

import { call, put } from 'redux-saga/effects';
import { buildQueryString } from 'src/helpers';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pHighestPriceData, p2pHighestPriceError, P2PHighestPriceFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pHighestPriceSaga(action: P2PHighestPriceFetch) {
    try {
        const data = yield call(API.get(config), `/public/offers/highest_price?${buildQueryString(action.payload)}`);

        yield put(p2pHighestPriceData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pHighestPriceError,
                },
            }),
        );
    }
}

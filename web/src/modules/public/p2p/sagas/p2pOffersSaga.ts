import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { offersData, offersError, OffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pOffersSaga(action: OffersFetch) {
    try {
        const { side, sort, base, quote, payment_method } = action.payload;
        const { data, headers } = yield call(API.get(config), `/public/offers?${buildQueryString(action.payload)}`);

        yield put(
            offersData({
                list: data,
                total: headers.total,
                page: action.payload.page,
                side,
                sort,
                base,
                quote,
                payment_method,
            }),
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: offersError,
                },
            }),
        );
    }
}

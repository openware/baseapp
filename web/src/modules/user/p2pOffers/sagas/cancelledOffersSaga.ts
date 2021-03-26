import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { cancelledOffersData, cancelledOffersError, CancelledOffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* cancelledOffersSaga(action: CancelledOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/private/offers?state=canceled&${buildQueryString(action.payload)}`);

        yield put(cancelledOffersData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: cancelledOffersError,
            },
        }));
    }
}

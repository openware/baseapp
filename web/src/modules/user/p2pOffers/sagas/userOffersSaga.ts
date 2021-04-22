import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import {
    userOfferOrdersData,
    userOfferOrdersError,
    UserOfferOrdersFetch,
    userOffersData,
    userOffersError,
    UserOffersFetch
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* userOffersSaga(action: UserOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/private/offers?${buildQueryString(action.payload)}`);

        yield put(userOffersData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOffersError,
            },
        }));
    }
}

export function* userOfferOrdersSaga(action: UserOfferOrdersFetch) {
    try {
        const { data } = yield call(API.get(config), `/private/offers/${action.payload.offer_id}/orders`);

        yield put(userOfferOrdersData(data));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOfferOrdersError,
            },
        }));
    }
}

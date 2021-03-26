import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { activeOffersData, activeOffersError, ActiveOffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* activeOffersSaga(action: ActiveOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/private/offers?state=active&${buildQueryString(action.payload)}`);

        yield put(activeOffersData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: activeOffersError,
            },
        }));
    }
}

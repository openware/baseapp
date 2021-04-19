import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { doneOffersData, doneOffersError, DoneOffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* doneOffersSaga(action: DoneOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/private/offers?state=done&${buildQueryString(action.payload)}`);

        yield put(doneOffersData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: doneOffersError,
            },
        }));
    }
}

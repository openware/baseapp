import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import {
    getMarketData,
    getMarketsListError,
    MarketUpdateFetch,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateMarketSaga(action: MarketUpdateFetch) {
    try {
        const { data } = yield call(API.post(config(getCsrfToken())), '/admin/markets/update', action.payload);
        yield put(getMarketData({ currentMarket: data }));
        yield put(alertPush({message: ['Market updated created'], type: 'success'}));
    } catch (error) {
        yield put(getMarketsListError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import {
    marketsData,
    marketsError,
    marketsTickersData,
    marketsTickersError,
    MarketsTickersFetch,
} from '../actions';
import { SET_CURRENT_MARKET } from '../constants';

const marketsRequestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const tickersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* marketsFetchSaga() {
    try {
        const markets = yield call(API.get(marketsRequestOptions), '/public/markets');
        yield put(marketsData(markets));
        yield put({ type: SET_CURRENT_MARKET, payload: markets[0] });
    } catch (error) {
        yield put(marketsError(error));
    }
}

export function* tickersSaga(action: MarketsTickersFetch) {
    try {
        const tickers = yield call(API.get(tickersOptions), `/public/markets/tickers`);

        if (tickers) {
            const pairs = Object.keys(tickers);

            const convertedTickers = pairs.reduce((result, pair) => {
                result[pair] = tickers[pair].ticker;
                return result;
            }, {});
            yield put(marketsTickersData(convertedTickers));
        }

    } catch (error) {
        yield put(marketsTickersError(error));
    }
}

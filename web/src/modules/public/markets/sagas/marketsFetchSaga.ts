import { call, put, takeLeading } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getOrderAPI } from '../../../../helpers';
import {
    marketsData,
    marketsError,
    MarketsFetch,
    marketsTickersData,
    marketsTickersError,
    MarketsTickersFetch,
    setCurrentMarketIfUnset,
} from '../actions';
import { MARKETS_FETCH, MARKETS_TICKERS_FETCH } from '../constants';

const marketsRequestOptions: RequestOptions = {
    apiVersion: getOrderAPI(),
};

const tickersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootMarketsSaga() {
    yield takeLeading(MARKETS_FETCH, marketsFetchSaga);
    yield takeLeading(MARKETS_TICKERS_FETCH, tickersSaga);
}

export function* marketsFetchSaga(action: MarketsFetch) {
    try {
        const payload = action.payload;
        const request = payload && payload.type ? `/public/markets?type=${payload.type}` : '/public/markets';

        const markets = yield call(API.get(payload ? tickersOptions : marketsRequestOptions), request);
        yield put(marketsData(markets));
        yield put(setCurrentMarketIfUnset(markets[0]));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: marketsError,
            },
        }));
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
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: marketsTickersError,
            },
        }));
    }
}

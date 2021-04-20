import { takeLeading } from 'redux-saga/effects';
import { MARKETS_FETCH, MARKETS_TICKERS_FETCH, MARKET_PRICE_FETCH } from '../constants';
import { marketsFetchSaga } from './marketsFetchSaga';
import { tickersSaga } from './tickersSaga';
import { marketPriceSaga } from './marketPriceSaga';

export function* rootMarketsSaga() {
    yield takeLeading(MARKETS_FETCH, marketsFetchSaga);
    yield takeLeading(MARKETS_TICKERS_FETCH, tickersSaga);
    yield takeLeading(MARKET_PRICE_FETCH, marketPriceSaga);
}

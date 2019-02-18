// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { MARKETS_FETCH, MARKETS_TICKERS_FETCH } from '../constants';
import { marketsFetchSaga, tickersSaga } from './marketsFetchSaga';

export function* rootMarketsSaga() {
    yield takeLatest(MARKETS_FETCH, marketsFetchSaga);
    yield takeLatest(MARKETS_TICKERS_FETCH, tickersSaga);
}

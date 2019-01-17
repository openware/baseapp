// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { MARKETS_FETCH, MARKETS_TICKERS_FETCH } from '../constants';
import { marketsFetchSaga, tickersSaga } from './marketsFetchSaga';

export function* rootMarketsSaga() {
    yield takeEvery(MARKETS_FETCH, marketsFetchSaga);
    yield takeEvery(MARKETS_TICKERS_FETCH, tickersSaga);
}

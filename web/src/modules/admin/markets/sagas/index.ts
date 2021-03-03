import { takeLatest } from 'redux-saga/effects';
import {
    MARKET_UPDATE_FETCH,
    MARKETS_LIST_FETCH,
} from '../constants';
import { getMarketsSaga } from './getMarketsSaga';
import { updateMarketSaga } from './updateMarketSaga';

export function* rootMarketsAdminSaga() {
    yield takeLatest(MARKETS_LIST_FETCH, getMarketsSaga);
    yield takeLatest(MARKET_UPDATE_FETCH, updateMarketSaga);
}

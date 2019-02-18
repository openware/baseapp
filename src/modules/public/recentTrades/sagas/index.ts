// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { RECENT_TRADES_FETCH } from '../constants';
import { recentTradesFetchSaga } from './recentTradesFetchSaga';

export function* rootRecentTradesSaga() {
    yield takeEvery(RECENT_TRADES_FETCH, recentTradesFetchSaga);
}

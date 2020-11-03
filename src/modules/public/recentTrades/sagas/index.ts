import { takeLeading } from 'redux-saga/effects';

import { RECENT_TRADES_FETCH } from '../constants';
import { recentTradesFetchSaga } from './recentTradesFetchSaga';

export function* rootRecentTradesSaga() {
    yield takeLeading(RECENT_TRADES_FETCH, recentTradesFetchSaga);
}

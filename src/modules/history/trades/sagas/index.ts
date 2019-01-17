// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { TRADES_FETCH } from '../constants';
import { tradesFetchSaga } from './tradesFetchSaga';

export function* rootTradeSaga() {
    yield takeLatest(TRADES_FETCH, tradesFetchSaga);
}

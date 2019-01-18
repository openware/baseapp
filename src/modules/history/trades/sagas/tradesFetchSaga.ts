// tslint:disable-next-line no-submodule-imports
import { call, put, select } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { TradesFetch } from '../actions';
import { TRADES_DATA, TRADES_ERROR } from '../constants';

export function* tradesFetchSaga(action: TradesFetch) {
    try {
        const config: RequestOptions = {
            apiVersion: 'peatio',
        };
        const getCurrentMarket = state => state.app.markets;
        const markets = yield select(getCurrentMarket);

        let trades = [];

        for (const market of markets.list) {
            const trade = yield call(API.get(config), `/market/trades?market=${market.id}`);
            trades = trades.concat(trade);
        }

        yield put({ type: TRADES_DATA, payload: trades });
    } catch (error) {
        yield put({ type: TRADES_ERROR, payload: error.message });
        yield put(handleError(error.code));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import { localeDate } from '../../../helpers';
import { RecentTradesFetch } from '../actions';
import { RECENT_TRADES_DATA, RECENT_TRADES_ERROR } from '../constants';

const tradesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const convertToTrades = trades => trades.map(trade => [
    localeDate(trade.created_at),
    trade.side,
    trade.price,
    trade.volume,
],
);

export function* recentTradesFetchSaga(action: RecentTradesFetch) {
    try {
        const market = action.payload;
        const trades = yield call(API.get(tradesOptions), `/public/markets/${market.id}/trades`);
        const convertedTrades = convertToTrades(trades);

        yield put({ type: RECENT_TRADES_DATA, payload: convertedTrades });
    } catch (error) {
        yield put({ type: RECENT_TRADES_ERROR, payload: error.message });
        yield put(handleError(error.message));
    }
}

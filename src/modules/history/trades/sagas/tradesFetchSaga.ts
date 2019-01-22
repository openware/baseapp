import moment = require('moment');
// tslint:disable-next-line no-submodule-imports
import { all, call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { localeDate } from '../../../../helpers/localeDate';
import { Market } from '../../../markets';
import { TradesFetch } from '../actions';
import { TRADES_DATA, TRADES_ERROR } from '../constants';
import { Trade } from '../types';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export const sortByDateTime = (a: Trade, b: Trade) => {
    return moment(localeDate(a.created_at), 'DD/MM HH:mm') > moment(localeDate(b.created_at), 'DD/MM HH:mm') ? -1 : 1;
};

export function* tradesFetchSaga(action: TradesFetch) {
    try {
        if (action.payload.length === 0) {
            throw new Error(`ERROR: Empty market provided to tradesFetchSaga`);
        }
        const createUrl = (market: Market) => `/market/trades?market=${market.id}`;
        const requests = action.payload.map(
            (market: Market) => call(API.get(config), createUrl(market)),
        );

        const results = yield all(requests);
        const trades = results
            .reduce((previous, current, index, []) => previous.concat(current))
            .sort(sortByDateTime);

        yield put({ type: TRADES_DATA, payload: trades });
    } catch (error) {
        yield put({ type: TRADES_ERROR, payload: error.message });
        yield put(handleError(error.code));
    }
}

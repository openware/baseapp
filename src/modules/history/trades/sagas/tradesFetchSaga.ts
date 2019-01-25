import moment = require('moment');
// tslint:disable-next-line no-submodule-imports
import { all, call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { localeDate } from '../../../../helpers/localeDate';
import { Market } from '../../../markets';
import { tradesData, tradesError, TradesFetch } from '../actions';
import { PrivateTrade } from '../types';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export const sortByDateTime = (a: PrivateTrade, b: PrivateTrade) => {
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

        yield put(tradesData(trades));
    } catch (error) {
        yield put(tradesError(error));
        yield put(handleError(error.code));
    }
}

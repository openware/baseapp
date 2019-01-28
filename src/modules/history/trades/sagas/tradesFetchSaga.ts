// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { tradesData, tradesError, TradesFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* tradesFetchSaga(action: TradesFetch) {
    try {
        const trades = yield call(API.get(config), `/market/trades`);
        yield put(tradesData(trades));
    } catch (error) {
        yield put(tradesError(error));
        yield put(handleError(error.code));
    }
}

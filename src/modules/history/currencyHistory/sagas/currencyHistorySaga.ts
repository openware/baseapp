// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    CurrencyHistoryFetch,
    failCurrencyHistory,
    setFullHistoryLength,
    successCurrencyHistory,
} from '../actions';


const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* currencyHistorySaga(action: CurrencyHistoryFetch) {
    try {
        const { page, currency, type, fullHistory } = action.payload;
        const history = yield call(API.get(config), `/account/${type}?limit=6&page=${page + 1}&currency=${currency}`);
        if (!fullHistory && !page) {
            const fullHistoryList = yield call(API.get(config), `/account/${type}?currency=${currency}`);
            yield put(setFullHistoryLength(fullHistoryList.length));
        }
        yield put(successCurrencyHistory({ list: history, page }));
    } catch (error) {
        yield put(failCurrencyHistory([]));
        yield put(handleError(error.code));
    }
}

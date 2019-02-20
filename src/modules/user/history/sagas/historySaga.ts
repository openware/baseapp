// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { pushAlertError } from '../../../public/alert';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* historySaga(action: HistoryFetch) {
    try {
        const { page, currency, type, limit } = action.payload;
        const coreEndpoint = {
            deposits: '/account/deposits',
            withdraws: '/account/withdraws',
            trades: '/market/trades',
        };
        const currencyParam = currency ? `&currency=${currency}` : '';
        const { data, headers } = yield call(API.get(config), `${coreEndpoint[type]}?limit=${limit}&page=${page + 1}${currencyParam}`);
        let updatedData = data;
        if (type === 'trades') {
            updatedData = data.slice(0, defaultStorageLimit());
        }

        yield put(successHistory({ list: updatedData, page, fullHistory: headers.total }));
    } catch (error) {
        yield put(failHistory([]));
        yield put(pushAlertError(error));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { getHistorySagaParam } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* historySaga(action: HistoryFetch) {
    try {
        const { type, page } = action.payload;
        const coreEndpoint = {
            deposits: '/account/deposits',
            withdraws: '/account/withdraws',
            trades: '/market/trades',
        };
        const params = getHistorySagaParam(action.payload);
        const { data, headers } = yield call(API.get(config), `${coreEndpoint[type]}?${params}`);
        let updatedData = data;

        if (type === 'trades') {
            updatedData = data.slice(0, defaultStorageLimit());
        }

        yield put(successHistory({ list: updatedData, page, total: headers.total }));
    } catch (error) {
        yield put(failHistory([]));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

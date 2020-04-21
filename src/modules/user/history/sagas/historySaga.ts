// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { getHistorySagaParam, sliceArray } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* historySaga(action: HistoryFetch) {
    try {
        const { type, limit, page } = action.payload;
        const coreEndpoint = {
            deposits: '/account/deposits',
            withdraws: '/account/withdraws',
            trades: '/market/trades',
        };
        const params = getHistorySagaParam(action.payload);
        const data = yield call(API.get(config), `${coreEndpoint[type]}?${params}`);

        let nextPageExists = false;

        if (limit && data.length === limit) {
            const testActionPayload = {
                ...action.payload,
                page: (page + 1) * limit,
                limit: 1,
            };
            const testParams = getHistorySagaParam(testActionPayload);
            const checkData = yield call(API.get(config), `${coreEndpoint[type]}?${testParams}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        let updatedData = data;

        if (type === 'trades') {
            updatedData = sliceArray(data, defaultStorageLimit());
        }

        yield put(successHistory({ list: updatedData, page, nextPageExists }));
    } catch (error) {
        yield put(failHistory([]));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

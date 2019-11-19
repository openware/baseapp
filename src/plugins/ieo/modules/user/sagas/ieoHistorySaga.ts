// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { buildQueryString } from '../../../../../helpers';
import { alertPush } from '../../../../../modules/public/alert';
import {
    HistoryIEOFetch,
    ieoHistoryData,
    ieoHistoryError,
} from '../actions';

const ieoHistoryOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: true,
};

export function* ieoHistorySaga(action: HistoryIEOFetch) {
    try {
        let endPoint = '/private/ieo/orders';
        if (action.payload) {
            endPoint = `${endPoint}?${buildQueryString(action.payload)}`;
        }
        const { data, headers } = yield call(API.get(ieoHistoryOptions), endPoint);
        yield put(ieoHistoryData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(ieoHistoryError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

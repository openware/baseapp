// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { failNewHistory, NewHistoryFetch, successNewHistory } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};
export function* newHistorySaga(action: NewHistoryFetch) {
    try {
        const params = Object.entries(action.payload).filter(w => w[1]).map(k => `${k[0]}=${encodeURIComponent(k[1])}`).join('&');
        const { data } = yield call(API.get(config), `/account/history?${params}`);

        yield put(successNewHistory({ list: data }));
    } catch (error) {
        yield put(failNewHistory({message: error.message, code: error.code}));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

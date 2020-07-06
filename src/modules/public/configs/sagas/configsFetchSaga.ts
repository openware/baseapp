import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import { configsData, configsError } from '../actions';

const configsOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* configsFetchSaga() {
    try {
        const restricted = localStorage.getItem('restricted');
        const underMaintenance = localStorage.getItem('maintenance');

        if (!restricted && !underMaintenance) {
            const configs = yield call(API.get(configsOptions), '/identity/configs');
            yield put(configsData(configs));
        }
    } catch (error) {
        yield put(configsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { licenseData, licenseError } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'tenko',
};

export function* licenseSaga() {
    try {
        const payload = { domain: window.location.hostname, key: window.env.licenseKey };
        const res = yield call(API.put(requestOptions), '/activate', payload);
        yield put(licenseData({ token: res.token }));
    } catch (error) {
        yield put(licenseError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

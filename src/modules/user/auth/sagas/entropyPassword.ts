// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { entropyPasswordData, entropyPasswordError, EntropyPasswordFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'barong',
};

export function* entropyPassword(action: EntropyPasswordFetch) {
    try {
        const data = yield call(API.post(config), '/identity/password/validate', action.payload);
        yield put(entropyPasswordData(data));
    } catch (error) {
        yield put(entropyPasswordError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

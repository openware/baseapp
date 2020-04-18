import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    customizationData,
    customizationError,
} from '../actions';

const customizationOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* customizationFetchSaga() {
    try {
        const customization = yield call(API.get(customizationOptions), '/customization');
        yield put(customizationData(customization));
    } catch (error) {
        yield put(customizationError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

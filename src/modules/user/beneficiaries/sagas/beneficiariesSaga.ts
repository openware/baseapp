// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import {
    beneficiariesData,
    beneficiariesError,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesSaga() {
    try {
        const beneficiaries = yield call(API.get(config), '/account/beneficiaries');
        yield put(beneficiariesData(beneficiaries));
    } catch (error) {
        yield put(beneficiariesError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    BeneficiariesCreate,
    beneficiariesCreateData,
    beneficiariesCreateError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesCreateSaga(action: BeneficiariesCreate) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const payload = yield call(API.post(config(currentCsrfToken)), '/account/beneficiaries', action.payload);
        yield put(beneficiariesCreateData(payload));
        yield put(alertPush({message: ['success.beneficiaries.created'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesCreateError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

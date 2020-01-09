// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    BeneficiariesDelete,
    beneficiariesDeleteData,
    beneficiariesDeleteError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesDeleteSaga(action: BeneficiariesDelete) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.delete(config(currentCsrfToken)), `/account/beneficiaries/${action.payload.id}`);
        yield put(beneficiariesDeleteData({ id: action.payload.id }));
        yield put(alertPush({message: ['success.beneficiaries.deleted'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesDeleteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

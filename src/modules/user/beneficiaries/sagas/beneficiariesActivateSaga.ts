// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import {
    BeneficiariesActivate,
    beneficiariesActivateData,
    beneficiariesActivateError,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesActivateSaga(action: BeneficiariesActivate) {
    try {
        const { id } = action.payload;
        const payload = yield call(API.patch(config), `/account/beneficiaries/${id}/activate`, action.payload);
        yield put(beneficiariesActivateData(payload));
        yield put(alertPush({message: ['success.beneficiaries.activated'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesActivateError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

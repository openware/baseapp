// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import {
    BeneficiariesResendPin,
    beneficiariesResendPinData,
    beneficiariesResendPinError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesResendPinSaga(action: BeneficiariesResendPin) {
    try {
        const { id } = action.payload;
        yield call(API.patch(config(getCsrfToken())), `/account/beneficiaries/${id}/resend_pin`, action.payload);
        yield put(beneficiariesResendPinData(action.payload));
        yield put(alertPush({message: ['success.beneficiaries.resent_pin'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesResendPinError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

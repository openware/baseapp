import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../../modules/public/alert';
import {
    BeneficiariesResendPin,
    beneficiariesResendPinData,
    beneficiariesResendPinError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'x-csrf-token': csrfToken },
    };
};

export function* beneficiariesResendPinSaga(action: BeneficiariesResendPin) {
    try {
        const payload = yield call(API.patch(config(getCsrfToken())), `/account/beneficiaries/${action.payload.id}/resend_pin`, action.payload);
        yield put(beneficiariesResendPinData({ sent_at: payload.sent_at}));
        yield put(alertPush({message: ['success.beneficiaries.resend'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesResendPinError(error));
        yield put(alertPush({
            message: error.message,
            code: error.code,
            type: 'error',
        }));
    }
}

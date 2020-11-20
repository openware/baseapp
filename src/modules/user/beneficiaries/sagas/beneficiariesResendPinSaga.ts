import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { BeneficiariesResendPin, beneficiariesResendPinData, beneficiariesResendPinError } from '../actions';

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
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: beneficiariesResendPinError,
            },
        }));
    }
}

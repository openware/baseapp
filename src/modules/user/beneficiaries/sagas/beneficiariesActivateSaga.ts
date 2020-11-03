import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import {
    BeneficiariesActivate,
    beneficiariesActivateData,
    beneficiariesActivateError,
    beneficiariesDataUpdate,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesActivateSaga(action: BeneficiariesActivate): SagaIterator {
    try {
        const { id } = action.payload;
        const payload = yield call(
            API.patch(config(getCsrfToken())),
            `/account/beneficiaries/${id}/activate`,
            action.payload
        );
        yield put(beneficiariesActivateData(payload));
        yield put(beneficiariesDataUpdate(payload));
        yield put(alertPush({ message: ['success.beneficiaries.activated'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: beneficiariesActivateError,
                },
            })
        );
    }
}

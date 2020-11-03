import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { BeneficiariesDelete, beneficiariesDeleteData, beneficiariesDeleteError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesDeleteSaga(action: BeneficiariesDelete) {
    try {
        yield call(API.delete(config(getCsrfToken())), `/account/beneficiaries/${action.payload.id}`);
        yield put(beneficiariesDeleteData({ id: action.payload.id }));
        yield put(alertPush({ message: ['success.beneficiaries.deleted'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: beneficiariesDeleteError,
                },
            })
        );
    }
}

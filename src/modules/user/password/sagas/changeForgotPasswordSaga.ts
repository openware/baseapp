import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { ChangeForgotPasswordFetch, changeForgotPasswordSuccess, forgotPasswordError } from '../actions';

const changeForgotPasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* changeForgotPasswordSaga(action: ChangeForgotPasswordFetch): SagaIterator {
    try {
        yield call(API.post(changeForgotPasswordConfig), '/identity/users/password/confirm_code', action.payload);
        yield put(changeForgotPasswordSuccess());
        yield put(alertPush({ message: ['success.password.changed.successfuly'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: forgotPasswordError,
                },
            })
        );
    }
}

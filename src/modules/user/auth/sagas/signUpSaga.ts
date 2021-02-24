import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { signUpData, signUpError, SignUpFetch, signUpRequireVerification } from '../actions';

const signUpConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signUpSaga(action: SignUpFetch) {
    try {
        const data = yield call(API.post(signUpConfig), '/identity/users', action.payload);

        if (data.csrf_token) {
            localStorage.setItem('csrfToken', data.csrf_token);
        }

        yield put(signUpRequireVerification({ requireVerification: true }));
        yield put(signUpData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: signUpError,
            },
        }));
    }
}

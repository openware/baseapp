// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError } from '../../../public/alert';
import { userData } from '../../profile';
import { signInError, SignInFetch, signInRequire2FA, signUpRequireVerification } from '../actions';


const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signInSaga(action: SignInFetch) {
    try {
        const user = yield call(API.post(sessionsConfig), '/identity/sessions', action.payload);
        yield put(userData({ user }));

        yield put(signInRequire2FA({ require2fa: user.otp }));
    } catch (error) {
        switch (error.code) {
            case 401:
                if (error.message === 'Your account is not active') {
                    yield put(signUpRequireVerification({requireVerification: true}));
                }
                break;
            case 403:
                yield put(signInRequire2FA({ require2fa: true }));
                break;
            default:
                yield put(signInError(error));
                break;
        }
        yield put(pushAlertError(error));
    }
}

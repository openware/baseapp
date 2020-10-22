import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { changeLanguage } from '../../../public/i18n';
import { userData } from '../../profile';
import { signInData, signInError, SignInFetch, signInRequire2FA, signUpRequireVerification } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signInSaga(action: SignInFetch) {
    try {
        const user = yield call(API.post(sessionsConfig), '/identity/sessions', action.payload);
        if (user.data && JSON.parse(user.data).language) {
            yield put(changeLanguage(JSON.parse(user.data).language));
        }
        yield put(userData({ user }));

        if (user.state === 'pending') {
            yield put(signUpRequireVerification({ requireVerification: true }));
        } else {
            localStorage.setItem('csrfToken', user.csrf_token);
            yield put(signInRequire2FA({ require2fa: user.otp }));
        }
        yield put(signInData());
    } catch (error) {
        switch (error.code) {
            case 401:
                if (error.message.indexOf('identity.session.missing_otp') > -1) {
                    yield put(signInRequire2FA({ require2fa: true }));
                    yield put(signInData());
                } else {
                    yield put(signInError(error));
                    yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                }
                break;
            default:
                yield put(signInError(error));
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        }
    }
}

// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { changeLanguage } from '../../../public/i18n';
import { userData } from '../../profile';
import { signInError, SignInFetch, signInRequire2FA, signUpRequireVerification } from '../actions';

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
        localStorage.setItem('csrfToken', user.csrf_token);
        yield put(signUpRequireVerification({ requireVerification: user.state === 'pending' }));
        yield put(signInRequire2FA({ require2fa: user.otp }));
    } catch (error) {
        switch (error.code) {
            case 401:
                if (error.message.indexOf('identity.session.not_active') > -1) {
                    yield put(signUpRequireVerification({requireVerification: true}));
                }
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                break;
            case 403:
                if (error.message.indexOf('identity.session.invalid_otp') > -1) {
                    yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                }
                yield put(signInRequire2FA({ require2fa: true }));
                break;
            default:
                yield put(signInError(error));
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        }
    }
}

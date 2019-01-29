// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { userData } from '../../profile';
import { signInError, SignInFetch, signInRequire2FA } from '../actions';


const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signInSaga(action: SignInFetch) {
    try {
        // clear error
        yield put(signInError({ code: undefined, message: undefined }));

        const user = yield call(API.post(sessionsConfig), '/identity/sessions', action.payload);
        const activity = yield call(API.get(sessionsConfig), '/resource/users/activity/all');
        yield put(userData({ user, activity }));

        yield put(signInRequire2FA({ require2fa: false }));
    } catch (error) {
        const responseStatus = error.code;
        const is2FAEnabled = responseStatus === 403;

        if (is2FAEnabled) {
            yield put(signInRequire2FA({ require2fa: true }));
        } else {
            yield put(signInError(error));
        }
    }
}

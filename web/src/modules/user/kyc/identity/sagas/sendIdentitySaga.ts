import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { sendIdentityData, sendIdentityError, SendIdentityFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendIdentitySaga(action: SendIdentityFetch) {
    try {
        const response = yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/profiles', action.payload);
        const defaultMessage = 'success.identity.accepted';
        const { message = defaultMessage } = response;
        yield put(sendIdentityData({ message }));
        yield put(alertPush({ message: [defaultMessage], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: sendIdentityError,
                },
            }),
        );
    }
}

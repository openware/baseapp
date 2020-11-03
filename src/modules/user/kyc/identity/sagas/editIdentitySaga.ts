import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { editIdentityData, editIdentityError, EditIdentityFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* editIdentitySaga(action: EditIdentityFetch) {
    try {
        const response = yield call(API.put(sessionsConfig(getCsrfToken())), '/resource/profiles', action.payload);
        const defaultMessage = 'success.identity.accepted';
        const { message = defaultMessage } = response;
        yield put(editIdentityData({ message }));
        yield put(alertPush({ message: [defaultMessage], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: editIdentityError,
                },
            })
        );
    }
}

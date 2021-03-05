import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { getCsrfToken } from '../../../../helpers';
import { API, RequestOptions } from '../../../../api';
import { PlatformCreateFetch, platformCreateData, platformCreateError } from '../actions';

const platformCreateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'sonic',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

const configUpdateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'sonic',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* platformCreateSaga(action: PlatformCreateFetch) {
    try {
        yield call(API.post(platformCreateOptions(getCsrfToken())), `/admin/platforms/new`, action.payload);
        if (action.callbackAction) {
            const { scope, key, value, component } = action.callbackAction;
            const payload = {
                scope,
                key,
                value,
            };

            yield call(API.put(configUpdateOptions(getCsrfToken())), `/admin/${component}/secret`, payload);
        }
        yield put(platformCreateData(action.payload));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: platformCreateError,
            },
        }));
    }
}

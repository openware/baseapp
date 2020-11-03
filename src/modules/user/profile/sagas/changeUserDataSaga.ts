import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { changeUserData, changeUserDataError, ChangeUserDataFetch } from '../actions';

const changeUserDataOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* changeUserDataSaga(action: ChangeUserDataFetch) {
    try {
        const user = yield call(
            API.put(changeUserDataOptions(getCsrfToken())),
            '/resource/users/me',
            action.payload.user
        );
        yield put(changeUserData({ user }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: changeUserDataError,
                },
            })
        );
    }
}

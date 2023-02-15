import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { abilitiesFetch } from '../../abilities';
import { userData, userError, UserFetch } from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userSaga(action: UserFetch) {
    try {
        const user = yield call(API.get(userOptions), '/resource/users/me');
        yield put(abilitiesFetch());
        yield put(userData({ user }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: userError,
                },
            }),
        );
    }
}

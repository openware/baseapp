import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userData, userError, UserFetch } from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userSaga(): SagaIterator {
    try {
        const user = yield call(API.get(userOptions), '/resource/users/me');
        yield put(userData({ user }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: userError,
                },
            })
        );
    }
}

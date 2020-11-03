import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { entropyPasswordData, entropyPasswordError, EntropyPasswordFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'barong',
};

export function* entropyPassword(action: EntropyPasswordFetch): SagaIterator {
    try {
        const data = yield call(API.post(config), '/identity/password/validate', action.payload);
        yield put(entropyPasswordData(data));
    } catch (error) {
        yield put(entropyPasswordError(error));
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: entropyPasswordError,
                },
            })
        );
    }
}

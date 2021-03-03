import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    sendAccessTokenData,
    sendAccessTokenError,
    SendAccessTokenFetch,
    setBlocklistStatus,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* blocklistAccessFetchSaga(action: SendAccessTokenFetch) {
    try {
        yield call(API.post(requestOptions), '/identity/users/access', action.payload);
        yield put(sendAccessTokenData());
        yield put(setBlocklistStatus({ status: 'allowed' }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: sendAccessTokenError,
            },
        }));
    }
}

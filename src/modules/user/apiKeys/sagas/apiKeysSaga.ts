import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { apiKeys2FAModal, apiKeysData, apiKeysError, ApiKeysFetch } from '../actions';

const apiKeysOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeysSaga(action: ApiKeysFetch) {
    try {
        const { pageIndex, limit } = action.payload;
        const apiKeys = yield call(API.get(apiKeysOptions), `/resource/api_keys?page=${pageIndex + 1}&limit=${limit}`);
        let nextPageExists = false;

        if (apiKeys.length === limit) {
            const checkData = yield call(API.get(apiKeysOptions), `/resource/api_keys?page=${(pageIndex + 1) * limit + 1}&limit=${1}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        yield put(apiKeysData({ apiKeys, pageIndex, nextPageExists }));
        yield put(apiKeys2FAModal({ active: false }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: apiKeysError,
            },
        }));
    }
}

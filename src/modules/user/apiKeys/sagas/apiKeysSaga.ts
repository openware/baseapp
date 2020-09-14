// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { apiKeys2FAModal, apiKeysData, ApiKeysFetch } from '../actions';

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
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}

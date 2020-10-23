import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { setBlocklistStatus } from '../../blocklistAccess';
import { configsData, configsError, ConfigsFetch } from '../actions';

const configsOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* configsFetchSaga(action: ConfigsFetch) {
    try {
        const configs = yield call(API.get(configsOptions), '/identity/configs');
        yield put(configsData(configs));
        yield put(setBlocklistStatus({ status: 'allowed' }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: configsError,
            },
        }));
    }
}

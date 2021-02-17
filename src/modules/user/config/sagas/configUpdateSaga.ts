import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { ConfigUpdate, configUpdateData, configUpdateError } from '../actions';

const configUpdateOptions: RequestOptions = {
    apiVersion: 'sonic',
};

export function* configUpdateSaga(action: ConfigUpdate) {
    try {
        const { scope, key, value } = action.payload;
        const payload = {
            scope,
            key,
            value,
        };

        yield call(API.put(configUpdateOptions), `/admin/${action.payload.component}/secret`, payload);
        yield put(configUpdateData(action.payload));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: configUpdateError,
            },
        }));
    }
}

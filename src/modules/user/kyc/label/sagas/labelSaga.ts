import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { labelData, labelError, LabelFetch } from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* labelSaga(action: LabelFetch) {
    try {
        const payload = yield call(API.get(userOptions), '/resource/labels');
        yield put(labelData(payload));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'console',
                extraOptions: {
                    actionError: labelError,
                },
            })
        );
    }
}

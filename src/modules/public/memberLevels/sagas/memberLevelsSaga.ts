import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { memberLevelsData, memberLevelsError } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* memberLevelsSaga(): SagaIterator {
    try {
        const data = yield call(API.get(requestOptions), '/public/member-levels');
        yield put(memberLevelsData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: memberLevelsError,
                },
            })
        );
    }
}

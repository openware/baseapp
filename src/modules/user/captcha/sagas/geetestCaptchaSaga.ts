import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { geetestCaptchaData, geetestCaptchaError, GeetestCaptchaFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* geetestCaptchaSaga(): SagaIterator {
    try {
        const keys = yield call(API.get(sessionsConfig), '/identity/users/register_geetest');
        yield put(geetestCaptchaData(keys));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: geetestCaptchaError,
                },
            })
        );
    }
}

import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    alertPush,
} from '../../../public/alert';
import {
    geetestCaptchaData,
    geetestCaptchaError,
    GeetestCaptchaFetch,
} from '../actions';


const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* geetestCaptchaSaga(action: GeetestCaptchaFetch) {
    try {
        const keys = yield call(API.get(sessionsConfig), '/identity/users/register_geetest');
        yield put(geetestCaptchaData(keys));
    } catch (error) {
        yield put(geetestCaptchaError(error));
        yield put(alertPush(error));
    }
}

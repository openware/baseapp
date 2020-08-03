import { takeLatest } from 'redux-saga/effects';
import {
    GET_GEETEST_CAPTCHA_FETCH,
} from '../constants';
import { geetestCaptchaSaga } from './geetestCaptchaSaga';

export function* rootGeetestCaptchaSaga() {
    yield takeLatest(GET_GEETEST_CAPTCHA_FETCH, geetestCaptchaSaga);
}

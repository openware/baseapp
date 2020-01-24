import {
    CommonError,
} from '../../types';
import {
    GET_GEETEST_CAPTCHA_DATA,
    GET_GEETEST_CAPTCHA_ERROR,
    GET_GEETEST_CAPTCHA_FETCH,
} from './constants';

export interface GeetestCaptchaKeys {
    gt: string;
    challenge: string;
}

export interface GeetestCaptchaData {
    type: typeof GET_GEETEST_CAPTCHA_DATA;
    keys: GeetestCaptchaKeys;
}

export interface GeetestCaptchaError {
    type: typeof GET_GEETEST_CAPTCHA_ERROR;
    error: CommonError;
}

export interface GeetestCaptchaFetch {
    type: typeof GET_GEETEST_CAPTCHA_FETCH;
}

export type GeetestCaptchaAction =
    GeetestCaptchaData
    | GeetestCaptchaError
    | GeetestCaptchaFetch;

export const geetestCaptchaData = (keys: GeetestCaptchaKeys): GeetestCaptchaData => ({
    type: GET_GEETEST_CAPTCHA_DATA,
    keys,
});

export const geetestCaptchaError = (error: CommonError): GeetestCaptchaError => ({
    type: GET_GEETEST_CAPTCHA_ERROR,
    error,
});

export const geetestCaptchaFetch = (): GeetestCaptchaFetch => ({
    type: GET_GEETEST_CAPTCHA_FETCH,
});

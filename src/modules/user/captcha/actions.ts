import { GeetestCaptchaResponse } from '../..';
import { CommonError } from '../../types';
import {
    GEETEST_CAPTCHA_SUCCESS_DATA,
    GET_GEETEST_CAPTCHA_DATA,
    GET_GEETEST_CAPTCHA_ERROR,
    GET_GEETEST_CAPTCHA_FETCH,
    RECAPTCHA_SUCCESS_DATA,
    RESET_CAPTCHA_STATE,
    SHOULD_GEETEST_RESET_FETCH,
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

export interface GeetestCaptchaSuccess {
    type: typeof GEETEST_CAPTCHA_SUCCESS_DATA;
    payload: {
        captcha_response?: GeetestCaptchaResponse;
    };
}

export interface SetGeetestShouldReset {
    type: typeof SHOULD_GEETEST_RESET_FETCH;
    payload: {
        shouldGeetestReset: boolean;
    };
}

export interface RecaptchaSuccess {
    type: typeof RECAPTCHA_SUCCESS_DATA;
    payload: {
        captcha_response?: string;
    };
}

export interface ResetCaptchaState {
    type: typeof RESET_CAPTCHA_STATE;
}

export type GeetestCaptchaAction =
    GeetestCaptchaData
    | GeetestCaptchaError
    | GeetestCaptchaFetch
    | GeetestCaptchaSuccess
    | SetGeetestShouldReset
    | RecaptchaSuccess
    | ResetCaptchaState;

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

export const setGeetestCaptchaSuccess = (payload: GeetestCaptchaSuccess['payload']): GeetestCaptchaSuccess => ({
    type: GEETEST_CAPTCHA_SUCCESS_DATA,
    payload,
});

export const setShouldGeetestReset = (payload: SetGeetestShouldReset['payload']): SetGeetestShouldReset => ({
    type: SHOULD_GEETEST_RESET_FETCH,
    payload,
});

export const setRecaptchaSuccess = (payload: RecaptchaSuccess['payload']): RecaptchaSuccess => ({
    type: RECAPTCHA_SUCCESS_DATA,
    payload,
});

export const resetCaptchaState = (): ResetCaptchaState => ({
    type: RESET_CAPTCHA_STATE,
});

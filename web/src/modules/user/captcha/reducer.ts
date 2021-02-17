import { GeetestCaptchaResponse } from '../..';
import { CommonError } from '../../types';
import { GeetestCaptchaAction, GeetestCaptchaKeys } from './actions';
import {
    GEETEST_CAPTCHA_SUCCESS_DATA,
    GET_GEETEST_CAPTCHA_DATA,
    GET_GEETEST_CAPTCHA_ERROR,
    GET_GEETEST_CAPTCHA_FETCH,
    RECAPTCHA_SUCCESS_DATA,
    RESET_CAPTCHA_STATE,
    SHOULD_GEETEST_RESET_FETCH,
} from './constants';

export interface GeetestCaptchaState {
    loading: boolean;
    getKeysSuccess: boolean;
    error?: CommonError;
    keys?: GeetestCaptchaKeys;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    shouldGeetestReset: boolean;
}

const initialState: GeetestCaptchaState = {
    loading: false,
    getKeysSuccess: false,
    captcha_response: '',
    reCaptchaSuccess: false,
    geetestCaptchaSuccess: false,
    shouldGeetestReset: false,
};

export const getGeetestCaptchaReducer = (state = initialState, action: GeetestCaptchaAction) => {
    switch (action.type) {
        case GET_GEETEST_CAPTCHA_DATA:
            return {
                ...state,
                keys: action.keys,
                loading: false,
                getKeysSuccess: true,
            };
        case GET_GEETEST_CAPTCHA_ERROR:
            return {
                ...state,
                loading: false,
                getKeysSuccess: false,
                error: action.error,
            };
        case GET_GEETEST_CAPTCHA_FETCH:
            return {
                ...state,
                loading: true,
                getKeysSuccess: false,
            };
        case GEETEST_CAPTCHA_SUCCESS_DATA:
            return {
                ...state,
                geetestCaptchaSuccess: true,
                captcha_response: action.payload.captcha_response,
                shouldGeetestReset: false,
            };
        case SHOULD_GEETEST_RESET_FETCH:
            return {
                ...state,
                shouldGeetestReset: action.payload.shouldGeetestReset,
            };
        case RECAPTCHA_SUCCESS_DATA:
            return {
                ...state,
                reCaptchaSuccess: true,
                captcha_response: action.payload.captcha_response,
            };
        case RESET_CAPTCHA_STATE:
            return {
                ...state,
                reCaptchaSuccess: false,
                geetestCaptchaSuccess: false,
                captcha_response: '',
            };
        default:
            return state;
    }
};

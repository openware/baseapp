import {
    CommonError,
} from '../../types';
import { GeetestCaptchaAction, GeetestCaptchaKeys } from './actions';
import {
    GET_GEETEST_CAPTCHA_DATA,
    GET_GEETEST_CAPTCHA_ERROR,
    GET_GEETEST_CAPTCHA_FETCH,
} from './constants';

export interface GeetestCaptchaState {
    loading: boolean;
    success: boolean;
    error?: CommonError;
    keys?: GeetestCaptchaKeys;
}

const initialState: GeetestCaptchaState = {
    loading: false,
    success: false,
};

export const getGeetestCaptchaReducer = (state = initialState, action: GeetestCaptchaAction) => {
    switch (action.type) {
        case GET_GEETEST_CAPTCHA_DATA:
            return {
                ...state,
                keys: action.keys,
                loading: false,
                success: true,
            };
        case GET_GEETEST_CAPTCHA_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        case GET_GEETEST_CAPTCHA_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        default:
            return state;
    }
};

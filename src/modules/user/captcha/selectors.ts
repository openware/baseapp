import { GeetestCaptchaResponse, RootState } from '../..';
import { GeetestCaptchaKeys } from './actions';

export const selectCaptchaKeys = (state: RootState): GeetestCaptchaKeys | undefined =>
    state.user.captcha.keys;

export const selectCaptchaDataObjectLoading = (state: RootState): boolean =>
    state.user.captcha.loading;

export const selectGeetestCaptchaSuccess = (state: RootState): boolean =>
    state.user.captcha.geetestCaptchaSuccess;

export const selectRecaptchaSuccess = (state: RootState): boolean =>
    state.user.captcha.reCaptchaSuccess;

export const selectShouldGeetestReset = (state: RootState): boolean =>
    state.user.captcha.shouldGeetestReset;

export const selectCaptchaResponse = (state: RootState): string | GeetestCaptchaResponse | undefined =>
    state.user.captcha.captcha_response;

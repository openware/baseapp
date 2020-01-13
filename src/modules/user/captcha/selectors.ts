import { RootState } from '../..';
import { GeetestCaptchaKeys } from './actions';

export const selectCaptchaKeys = (state: RootState): GeetestCaptchaKeys | undefined =>
    state.user.captchaKeys.keys;

export const selectCaptchaDataObjectLoading = (state: RootState): boolean =>
    state.user.captchaKeys.loading;

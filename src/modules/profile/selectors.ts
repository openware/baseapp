import { RootState, User } from '../index';
import { CommonError } from '../types';
import { Activity, Tier } from './actions';

export const selectUserActivity = (state: RootState): Activity[] | undefined =>
    state.app.profile.userData.userActivity;

export const selectChangePasswordError = (state: RootState): CommonError | undefined =>
    state.app.profile.passwordChange.error;

export const selectChangePasswordSuccess = (state: RootState): boolean | undefined =>
    state.app.profile.passwordChange.success;

export const selectTwoFactorAuthQR = (state: RootState): string =>
    state.app.profile.twoFactorAuth.url;

export const selectTwoFactorAuthBarcode = (state: RootState): string =>
    state.app.profile.twoFactorAuth.barcode;

export const selectTwoFactorAuthSuccess = (state: RootState): boolean | undefined =>
    state.app.profile.twoFactorAuth.success;

export const selectTwoFactorAuthError = (state: RootState): CommonError | undefined =>
    state.app.profile.twoFactorAuth.error;

export const selectTiersData = (state: RootState): Tier =>
    state.app.profile.tiers.tier;

export const selectTiersError = (state: RootState): CommonError | undefined =>
    state.app.profile.tiers.error;

export const selectTiersDisabled = (state: RootState): boolean =>
    state.app.profile.tiers.disabled;

export const selectUserLoggedIn = (state: RootState): boolean => {
    const { app: { profile } } = state;
    return !profile.userData.isFetching && profile.userData.user.state === 'active';
};

export const selectUserInfo = (state: RootState): User =>
    state.app.profile.userData.user;

export const selectUserError = (state: RootState): CommonError | undefined =>
    state.app.profile.userData.error;

export const selectUserFetching = (state: RootState): boolean =>
    state.app.profile.userData.isFetching;

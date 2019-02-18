import { RootState } from '../..';
import { CommonError } from '../../types';
import { Tier, User } from './actions';

export const selectChangePasswordError = (state: RootState): CommonError | undefined =>
    state.user.profile.passwordChange.error;

export const selectChangePasswordSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.passwordChange.success;

export const selectTwoFactorAuthQR = (state: RootState): string =>
    state.user.profile.twoFactorAuth.url;

export const selectTwoFactorAuthBarcode = (state: RootState): string =>
    state.user.profile.twoFactorAuth.barcode;

export const selectTwoFactorAuthSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.twoFactorAuth.success;

export const selectTwoFactorAuthError = (state: RootState): CommonError | undefined =>
    state.user.profile.twoFactorAuth.error;

export const selectTiersData = (state: RootState): Tier =>
    state.user.profile.tiers.tier;

export const selectTiersError = (state: RootState): CommonError | undefined =>
    state.user.profile.tiers.error;

export const selectTiersDisabled = (state: RootState): boolean =>
    state.user.profile.tiers.disabled;

export const selectUserLoggedIn = (state: RootState): boolean => {
    const { user: { profile } } = state;
    return !profile.userData.isFetching && profile.userData.user.state === 'active';
};

export const selectUserInfo = (state: RootState): User =>
    state.user.profile.userData.user;

export const selectUserError = (state: RootState): CommonError | undefined =>
    state.user.profile.userData.error;

export const selectUserFetching = (state: RootState): boolean =>
    state.user.profile.userData.isFetching;

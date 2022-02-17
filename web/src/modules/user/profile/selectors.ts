import { RootState } from '../..';
import { User } from './types';

export const selectChangePasswordSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.passwordChange.success;

export const selectTwoFactorAuthQR = (state: RootState): string =>
    state.user.profile.twoFactorAuth.url;

export const selectTwoFactorAuthBarcode = (state: RootState): string =>
    state.user.profile.twoFactorAuth.barcode;

export const selectTwoFactorAuthSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.twoFactorAuth.success;

export const selectUserLoggedIn = (state: RootState): boolean => {
    const { user: { profile } } = state;

    return !profile.userData.isFetching && profile.userData.user.state === 'active';
};

export const selectUserInfo = (state: RootState): User =>
    state.user.profile.userData.user;

export const selectUserFetching = (state: RootState): boolean =>
    state.user.profile.userData.isFetching;

export const selectUserDataChange = (state: RootState): boolean | undefined =>
    state.user.profile.userData.success;

export const selectUserIsMember = (state: RootState): boolean =>
    state.user.profile.userData.user.role !== 'admin' && state.user.profile.userData.user.role !== 'superadmin'

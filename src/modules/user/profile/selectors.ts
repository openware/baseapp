import { RootState } from '../..';
import { ProfileIdentity, Tier, User } from './actions';

export const selectChangePasswordSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.passwordChange.success;

export const selectTwoFactorAuthQR = (state: RootState): string =>
    state.user.profile.twoFactorAuth.url;

export const selectTwoFactorAuthBarcode = (state: RootState): string =>
    state.user.profile.twoFactorAuth.barcode;

export const selectTwoFactorAuthSuccess = (state: RootState): boolean | undefined =>
    state.user.profile.twoFactorAuth.success;

export const selectTiersData = (state: RootState): Tier =>
    state.user.profile.tiers.tier;

export const selectTiersDisabled = (state: RootState): boolean =>
    state.user.profile.tiers.disabled;

export const selectUserLoggedIn = (state: RootState): boolean => {
    const { user: { profile } } = state;
    return !profile.userData.isFetching && profile.userData.user.state === 'active';
};

export const selectUserInfo = (state: RootState): User =>
    state.user.profile.userData.user;

export const selectProfileIdentityInfo = (state: RootState): ProfileIdentity =>
    state.user.profile.identity.profileIdentity;

export const selectUserFetching = (state: RootState): boolean =>
    state.user.profile.userData.isFetching;

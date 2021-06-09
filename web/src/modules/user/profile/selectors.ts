import { RootState } from '../..';
import { User, UserProfile, Organization } from './types';

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

export const selectUserProfile = (state: RootState): UserProfile => {
    const { profiles } = selectUserInfo(state);
    const verifiedProfiles = profiles.length ? profiles.filter((i) => i.state === 'verified') : [];
    const lastVerifiedProfile = verifiedProfiles.length && verifiedProfiles[verifiedProfiles.length - 1];
    return lastVerifiedProfile;
}

export const selectUserFetching = (state: RootState): boolean =>
    state.user.profile.userData.isFetching;

export const selectUserDataChange = (state: RootState): boolean | undefined =>
    state.user.profile.userData.success;

export const selectUserOrganization = (state: RootState): Organization | null => {
    const { organization } = selectUserInfo(state);
    return organization;
}
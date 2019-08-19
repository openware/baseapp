import { RootState } from '../..';

export const selectAppVersion = (state: RootState): string =>
    state.user.guard.version;

export const selectGuardModalOpened = (state: RootState): boolean =>
    state.user.guard.versionModalOpened;

export const selectBuildExpire = (state: RootState): string =>
    state.user.guard.buildExpire;

export const selectTenkoPublicKey = (state: RootState): string =>
    state.user.guard.tenkoPublicKey;

export const selectTokenFetching = (state: RootState): boolean =>
    state.user.guard.tokenFetching;

export const selectToken = (state: RootState): string =>
    state.user.guard.token;

export const selectLicenseExpiration = (state: RootState): number | null =>
    state.user.guard.expiresAt;

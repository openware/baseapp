import { CommonError } from '../../types';
import {
    PROFILE_CHANGE_PASSWORD_DATA,
    PROFILE_CHANGE_PASSWORD_ERROR,
    PROFILE_CHANGE_PASSWORD_FETCH,
    PROFILE_CHANGE_USER_LEVEL,
    PROFILE_GENERATE_2FA_QRCODE_DATA,
    PROFILE_GENERATE_2FA_QRCODE_ERROR,
    PROFILE_GENERATE_2FA_QRCODE_FETCH,
    PROFILE_IDENTITY_DATA,
    PROFILE_IDENTITY_ERROR,
    PROFILE_IDENTITY_FETCH,
    PROFILE_RESET_USER,
    PROFILE_TEST_STATE,
    PROFILE_TIERS_DATA,
    PROFILE_TIERS_DISABLE,
    PROFILE_TIERS_ERROR,
    PROFILE_TIERS_FETCH,
    PROFILE_TOGGLE_2FA_DATA,
    PROFILE_TOGGLE_2FA_ERROR,
    PROFILE_TOGGLE_2FA_FETCH,
    PROFILE_TOGGLE_USER_2FA,
    PROFILE_USER_DATA,
    PROFILE_USER_ERROR,
    PROFILE_USER_FETCH,
} from './constants';

export interface Tier {
    color: string;
    name: string;
    min_holding: number;
    fee_discount: number;
}

export interface User {
    email: string;
    level: number;
    otp: boolean;
    role: string;
    state: string;
    uid: string;
    csrf_token?: string;
}

export interface ProfileIdentity {
  first_name: string;
  last_name: string;
  dob: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  number: string;
}

export interface ChangePasswordFetch {
    type: typeof PROFILE_CHANGE_PASSWORD_FETCH;
    payload: {
        old_password: string;
        new_password: string;
        confirm_password: string;
    };
}

export interface ChangePasswordData {
    type: typeof PROFILE_CHANGE_PASSWORD_DATA;
}

export interface ChangePasswordError {
    type: typeof PROFILE_CHANGE_PASSWORD_ERROR;
    payload: CommonError | undefined;
}

export interface Toggle2FAFetch {
    type: typeof PROFILE_TOGGLE_2FA_FETCH;
    payload: {
        code: string;
        enable: boolean;
    };
}

export interface Toggle2FAData {
    type: typeof PROFILE_TOGGLE_2FA_DATA;
}

export interface Toggle2FAError {
    type: typeof PROFILE_TOGGLE_2FA_ERROR;
    payload: CommonError;
}

export interface Generate2faQRFetch {
    type: typeof PROFILE_GENERATE_2FA_QRCODE_FETCH;
}

export interface Generate2faQRData {
    type: typeof PROFILE_GENERATE_2FA_QRCODE_DATA;
    payload: {
        barcode: string;
        url: string;
    };
}

export interface Generate2faQRError {
    type: typeof PROFILE_GENERATE_2FA_QRCODE_ERROR;
    payload: CommonError;
}

export interface TiersFetch {
    type: typeof PROFILE_TIERS_FETCH;
    payload: {
        uid: string;
        currency: string;
    };
}

export interface TiersData {
    type: typeof PROFILE_TIERS_DATA;
    payload: Tier;
}

export interface TiersError {
    type: typeof PROFILE_TIERS_ERROR;
    payload: CommonError;
}

export interface TiersDisable {
    type: typeof PROFILE_TIERS_DISABLE;
}

export interface UserFetch {
    type: typeof PROFILE_USER_FETCH;
}

export interface UserInfo {
    type: typeof PROFILE_USER_DATA;
    payload: {
        user: User;
    };
}

export interface UserError {
    type: typeof PROFILE_USER_ERROR;
    payload: CommonError;
}

export interface UserReset {
    type: typeof PROFILE_RESET_USER;
}

export interface TestProfileState {
    type: typeof PROFILE_TEST_STATE;
}

export interface ChangeUserLevel {
    type: typeof PROFILE_CHANGE_USER_LEVEL;
    payload: {
        level: number;
    };
}

export interface ProfileIdentityFetch {
    type: typeof PROFILE_IDENTITY_FETCH;
}

export interface ProfileIdentityInfo {
    type: typeof PROFILE_IDENTITY_DATA;
    payload: ProfileIdentity;
}

export interface ProfileIdentityError {
    type: typeof PROFILE_IDENTITY_ERROR;
    payload: CommonError;
}

export interface ToggleUser2fa {
    type: typeof PROFILE_TOGGLE_USER_2FA;
}

export type ProfileAction =
    | ChangePasswordFetch
    | ChangePasswordData
    | ChangePasswordError
    | Toggle2FAFetch
    | Toggle2FAData
    | Toggle2FAError
    | Generate2faQRFetch
    | Generate2faQRData
    | Generate2faQRError
    | TiersFetch
    | TiersData
    | TiersError
    | TiersDisable
    | UserFetch
    | UserInfo
    | UserError
    | UserReset
    | TestProfileState
    | ChangeUserLevel
    | ToggleUser2fa
    | ProfileIdentityFetch
    | ProfileIdentityInfo
    | ProfileIdentityError;

export const changePasswordFetch = (payload: ChangePasswordFetch['payload']): ChangePasswordFetch => ({
    type: PROFILE_CHANGE_PASSWORD_FETCH,
    payload,
});

export const changePasswordData = (): ChangePasswordData => ({
    type: PROFILE_CHANGE_PASSWORD_DATA,
});

export const changePasswordError = (payload: ChangePasswordError['payload']): ChangePasswordError => ({
    type: PROFILE_CHANGE_PASSWORD_ERROR,
    payload,
});

export const toggle2faFetch = (payload: Toggle2FAFetch['payload']): Toggle2FAFetch => ({
    type: PROFILE_TOGGLE_2FA_FETCH,
    payload,
});

export const toggle2faData = (): Toggle2FAData => ({
    type: PROFILE_TOGGLE_2FA_DATA,
});

export const toggle2faError = (payload: Toggle2FAError['payload']): Toggle2FAError => ({
    type: PROFILE_TOGGLE_2FA_ERROR,
    payload,
});

export const generate2faQRFetch = (): Generate2faQRFetch => ({
    type: PROFILE_GENERATE_2FA_QRCODE_FETCH,
});

export const generate2faQRData = (payload: Generate2faQRData['payload']): Generate2faQRData => ({
    type: PROFILE_GENERATE_2FA_QRCODE_DATA,
    payload,
});

export const generate2faQRError = (payload: Generate2faQRError['payload']): Generate2faQRError => ({
    type: PROFILE_GENERATE_2FA_QRCODE_ERROR,
    payload,
});

export const tiersFetch = (payload: TiersFetch['payload']): TiersFetch => ({
    type: PROFILE_TIERS_FETCH,
    payload,
});

export const tiersData = (payload: TiersData['payload']): TiersData => ({
    type: PROFILE_TIERS_DATA,
    payload,
});

export const tiersError = (payload: TiersError['payload']): TiersError => ({
    type: PROFILE_TIERS_ERROR,
    payload,
});

export const tiersDisable = (): TiersDisable => ({
    type: PROFILE_TIERS_DISABLE,
});

export const userFetch = (): UserFetch => ({
    type: PROFILE_USER_FETCH,
});

export const userData = (payload: UserInfo['payload']): UserInfo => ({
    type: PROFILE_USER_DATA,
    payload,
});

export const userError = (payload: UserError['payload']): UserError => ({
    type: PROFILE_USER_ERROR,
    payload,
});

export const userReset = (): UserReset => ({
    type: PROFILE_RESET_USER,
});

export const changeUserLevel =
    (payload: ChangeUserLevel['payload']): ChangeUserLevel => ({
        type: PROFILE_CHANGE_USER_LEVEL,
        payload,
    });

export const toggleUser2fa = (): ToggleUser2fa => ({
        type: PROFILE_TOGGLE_USER_2FA,
    });

export const profileIdentityFetch = (): ProfileIdentityFetch => ({
    type: PROFILE_IDENTITY_FETCH,
});

export const profileIdentityData = (payload: ProfileIdentityInfo['payload']): ProfileIdentityInfo => ({
    type: PROFILE_IDENTITY_DATA,
    payload,
});

export const profileIdentityError = (payload: ProfileIdentityError['payload']): ProfileIdentityError => ({
    type: PROFILE_IDENTITY_ERROR,
    payload,
});

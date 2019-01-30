import { CommonError } from '../types';
import {
    CHANGE_PASSWORD_DATA,
    CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD_FETCH,
    CHANGE_USER_LEVEL,
    ENABLE_USER_2FA,
    GENERATE_2FA_QRCODE_DATA,
    GENERATE_2FA_QRCODE_ERROR,
    GENERATE_2FA_QRCODE_FETCH,
    GET_USER_DATA,
    GET_USER_ERROR,
    GET_USER_FETCH,
    RESET_USER,
    TEST_PROFILE_STATE,
    TIERS_DATA,
    TIERS_DISABLE,
    TIERS_ERROR,
    TIERS_FETCH,
    TOGGLE_2FA_DATA,
    TOGGLE_2FA_ERROR,
    TOGGLE_2FA_FETCH,
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
}

export interface ChangePasswordFetch {
    type: typeof CHANGE_PASSWORD_FETCH;
    payload: {
        old_password: string;
        new_password: string;
        confirm_password: string;
    };
}

export interface ChangePasswordData {
    type: typeof CHANGE_PASSWORD_DATA;
}

export interface ChangePasswordError {
    type: typeof CHANGE_PASSWORD_ERROR;
    payload: CommonError | undefined;
}

export interface Toggle2FAFetch {
    type: typeof TOGGLE_2FA_FETCH;
    payload: {
        code: string;
        enable: boolean;
    };
}

export interface Toggle2FAData {
    type: typeof TOGGLE_2FA_DATA;
}

export interface Toggle2FAError {
    type: typeof TOGGLE_2FA_ERROR;
    payload: CommonError;
}

export interface Generate2faQRFetch {
    type: typeof GENERATE_2FA_QRCODE_FETCH;
}

export interface Generate2faQRData {
    type: typeof GENERATE_2FA_QRCODE_DATA;
    payload: {
        barcode: string;
        url: string;
    };
}

export interface Generate2faQRError {
    type: typeof GENERATE_2FA_QRCODE_ERROR;
    payload: CommonError;
}

export interface TiersFetch {
    type: typeof TIERS_FETCH;
    payload: {
        uid: string;
        currency: string;
    };
}

export interface TiersData {
    type: typeof TIERS_DATA;
    payload: Tier;
}

export interface TiersError {
    type: typeof TIERS_ERROR;
    payload: CommonError;
}

export interface TiersDisable {
    type: typeof TIERS_DISABLE;
}

export interface UserFetch {
    type: typeof GET_USER_FETCH;
}

export interface UserInfo {
    type: typeof GET_USER_DATA;
    payload: {
        user: User;
    };
}

export interface UserError {
    type: typeof GET_USER_ERROR;
    payload: CommonError;
}

export interface UserReset {
    type: typeof RESET_USER;
}

export interface TestProfileState {
    type: typeof TEST_PROFILE_STATE;
}

export interface ChangeUserLevel {
    type: typeof CHANGE_USER_LEVEL;
    payload: {
        level: number;
    };
}

export interface EnableUser2fa {
    type: typeof ENABLE_USER_2FA;
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
    | EnableUser2fa;

export const changePasswordFetch = (payload: ChangePasswordFetch['payload']): ChangePasswordFetch => ({
    type: CHANGE_PASSWORD_FETCH,
    payload,
});

export const changePasswordData = (): ChangePasswordData => ({
    type: CHANGE_PASSWORD_DATA,
});

export const changePasswordError = (payload: ChangePasswordError['payload']): ChangePasswordError => ({
    type: CHANGE_PASSWORD_ERROR,
    payload,
});

export const toggle2faFetch = (payload: Toggle2FAFetch['payload']): Toggle2FAFetch => ({
    type: TOGGLE_2FA_FETCH,
    payload,
});

export const toggle2faData = (): Toggle2FAData => ({
    type: TOGGLE_2FA_DATA,
});

export const toggle2faError = (payload: Toggle2FAError['payload']): Toggle2FAError => ({
    type: TOGGLE_2FA_ERROR,
    payload,
});

export const generate2faQRFetch = (): Generate2faQRFetch => ({
    type: GENERATE_2FA_QRCODE_FETCH,
});

export const generate2faQRData = (payload: Generate2faQRData['payload']): Generate2faQRData => ({
    type: GENERATE_2FA_QRCODE_DATA,
    payload,
});

export const generate2faQRError = (payload: Generate2faQRError['payload']): Generate2faQRError => ({
    type: GENERATE_2FA_QRCODE_ERROR,
    payload,
});

export const tiersFetch = (payload: TiersFetch['payload']): TiersFetch => ({
    type: TIERS_FETCH,
    payload,
});

export const tiersData = (payload: TiersData['payload']): TiersData => ({
    type: TIERS_DATA,
    payload,
});

export const tiersError = (payload: TiersError['payload']): TiersError => ({
    type: TIERS_ERROR,
    payload,
});

export const tiersDisable = (): TiersDisable => ({
    type: TIERS_DISABLE,
});

export const userFetch = (): UserFetch => ({
    type: GET_USER_FETCH,
});

export const userData = (payload: UserInfo['payload']): UserInfo => ({
    type: GET_USER_DATA,
    payload,
});

export const userError = (payload: UserError['payload']): UserError => ({
    type: GET_USER_ERROR,
    payload,
});

export const userReset = (): UserReset => ({
    type: RESET_USER,
});

export const changeUserLevel =
    (payload: ChangeUserLevel['payload']): ChangeUserLevel => ({
        type: CHANGE_USER_LEVEL,
        payload,
    });

export const enableUser2fa = (): EnableUser2fa => ({
        type: ENABLE_USER_2FA,
    });

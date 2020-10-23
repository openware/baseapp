import { CommonError } from '../../types';
import {
    PROFILE_CHANGE_PASSWORD_DATA,
    PROFILE_CHANGE_PASSWORD_ERROR,
    PROFILE_CHANGE_PASSWORD_FETCH,
    PROFILE_CHANGE_USER_DATA,
    PROFILE_CHANGE_USER_ERROR,
    PROFILE_CHANGE_USER_FETCH,
    PROFILE_CHANGE_USER_LEVEL,
    PROFILE_GENERATE_2FA_QRCODE_DATA,
    PROFILE_GENERATE_2FA_QRCODE_ERROR,
    PROFILE_GENERATE_2FA_QRCODE_FETCH,
    PROFILE_RESET_USER,
    PROFILE_TOGGLE_2FA_DATA,
    PROFILE_TOGGLE_2FA_ERROR,
    PROFILE_TOGGLE_2FA_FETCH,
    PROFILE_TOGGLE_USER_2FA,
    PROFILE_USER_DATA,
    PROFILE_USER_ERROR,
    PROFILE_USER_FETCH,
} from './constants';
import { User } from './types';

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
    error: CommonError;
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
    error: CommonError;
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
    error: CommonError;
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
    error: CommonError;
}

export interface UserReset {
    type: typeof PROFILE_RESET_USER;
}

export interface ChangeUserLevel {
    type: typeof PROFILE_CHANGE_USER_LEVEL;
    payload: {
        level: number;
    };
}

export interface ToggleUser2fa {
    type: typeof PROFILE_TOGGLE_USER_2FA;
}

export interface ChangeUserDataFetch {
    type: typeof PROFILE_CHANGE_USER_FETCH;
    payload: {
        user: User;
    };
}

export interface ChangeUserData {
    type: typeof PROFILE_CHANGE_USER_DATA;
    payload: {
        user: User;
    };
}

export interface ChangeUserDataError {
    type: typeof PROFILE_CHANGE_USER_ERROR;
    error: CommonError;
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
    | UserFetch
    | UserInfo
    | UserError
    | UserReset
    | ChangeUserLevel
    | ToggleUser2fa
    | ChangeUserDataFetch
    | ChangeUserData
    | ChangeUserDataError;

export const changePasswordFetch = (payload: ChangePasswordFetch['payload']): ChangePasswordFetch => ({
    type: PROFILE_CHANGE_PASSWORD_FETCH,
    payload,
});

export const changePasswordData = (): ChangePasswordData => ({
    type: PROFILE_CHANGE_PASSWORD_DATA,
});

export const changePasswordError = (error: CommonError): ChangePasswordError => ({
    type: PROFILE_CHANGE_PASSWORD_ERROR,
    error,
});

export const toggle2faFetch = (payload: Toggle2FAFetch['payload']): Toggle2FAFetch => ({
    type: PROFILE_TOGGLE_2FA_FETCH,
    payload,
});

export const toggle2faData = (): Toggle2FAData => ({
    type: PROFILE_TOGGLE_2FA_DATA,
});

export const toggle2faError = (error: CommonError): Toggle2FAError => ({
    type: PROFILE_TOGGLE_2FA_ERROR,
    error,
});

export const generate2faQRFetch = (): Generate2faQRFetch => ({
    type: PROFILE_GENERATE_2FA_QRCODE_FETCH,
});

export const generate2faQRData = (payload: Generate2faQRData['payload']): Generate2faQRData => ({
    type: PROFILE_GENERATE_2FA_QRCODE_DATA,
    payload,
});

export const generate2faQRError = (error: CommonError): Generate2faQRError => ({
    type: PROFILE_GENERATE_2FA_QRCODE_ERROR,
    error,
});

export const userFetch = (): UserFetch => ({
    type: PROFILE_USER_FETCH,
});

export const userData = (payload: UserInfo['payload']): UserInfo => ({
    type: PROFILE_USER_DATA,
    payload,
});

export const userError = (error: CommonError): UserError => ({
    type: PROFILE_USER_ERROR,
    error,
});

export const userReset = (): UserReset => ({
    type: PROFILE_RESET_USER,
});

export const changeUserLevel = (payload: ChangeUserLevel['payload']): ChangeUserLevel => ({
    type: PROFILE_CHANGE_USER_LEVEL,
    payload,
});

export const toggleUser2fa = (): ToggleUser2fa => ({
    type: PROFILE_TOGGLE_USER_2FA,
});

export const changeUserDataFetch = (payload: ChangeUserDataFetch['payload']): ChangeUserDataFetch => ({
    type: PROFILE_CHANGE_USER_FETCH,
    payload,
});

export const changeUserData = (payload: ChangeUserData['payload']): ChangeUserData => ({
    type: PROFILE_CHANGE_USER_DATA,
    payload,
});

export const changeUserDataError = (error: CommonError): ChangeUserDataError => ({
    type: PROFILE_CHANGE_USER_ERROR,
    error,
});

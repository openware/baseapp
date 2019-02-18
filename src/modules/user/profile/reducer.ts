import { CommonError } from '../../types';
import { ProfileAction, Tier, User } from './actions';
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
    TIERS_DATA,
    TIERS_DISABLE,
    TIERS_ERROR,
    TIERS_FETCH,
    TOGGLE_2FA_DATA,
    TOGGLE_2FA_ERROR,
    TOGGLE_2FA_FETCH,
} from './constants';

export interface ProfileState {
    passwordChange: {
        success?: boolean;
        error?: CommonError;
    };
    twoFactorAuth: {
        barcode: string;
        url: string;
        success?: boolean;
        error?: CommonError;
    };
    tiers: {
        tier: Tier;
        disabled: boolean;
        error?: CommonError;
    };
    userData: {
        user: User;
        error?: CommonError;
        isFetching: boolean;
    };
}

const defaultTier = {
    color: '',
    name: '',
    min_holding: 0,
    fee_discount: 0,
};

const defaultUser = {
    email: '',
    level: 0,
    otp: false,
    role: '',
    state: '',
    uid: '',
};

export const initialStateProfile: ProfileState = {
    passwordChange: {
        success: false,
    },
    twoFactorAuth: {
        barcode: '',
        url: '',
    },
    tiers: {
        tier: defaultTier,
        disabled: false,
    },
    userData: {
        user: defaultUser,
        isFetching: true,
    },
};

const passwordChangeReducer = (state: ProfileState['passwordChange'], action: ProfileAction) => {
    switch (action.type) {
        case CHANGE_PASSWORD_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case CHANGE_PASSWORD_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case CHANGE_PASSWORD_ERROR:
            return  {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

const twoAuthReducer = (state: ProfileState['twoFactorAuth'], action: ProfileAction) => {
    switch (action.type) {
        case GENERATE_2FA_QRCODE_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
                barcode: '',
                url: '',
            };
        case GENERATE_2FA_QRCODE_DATA:
            return {
                ...state,
                error: undefined,
                barcode: action.payload.barcode,
                url: action.payload.url,
            };
        case GENERATE_2FA_QRCODE_ERROR:
            return {
                ...state,
                success: false,
                error: action.payload,
                barcode: '',
                url: '',
            };
        case TOGGLE_2FA_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case TOGGLE_2FA_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case TOGGLE_2FA_ERROR:
            return {
                ...state,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const tiersReducer = (state: ProfileState['tiers'], action: ProfileAction) => {
    switch (action.type) {
        case TIERS_FETCH:
            return {
                ...state,
                disabled: false,
                error: undefined,
                tier: defaultTier,
            };
        case TIERS_DATA:
            return {
                ...state,
                error: undefined,
                disabled: false,
                tier: action.payload,
            };
        case TIERS_ERROR:
            return {
                ...state,
                disabled: false,
                error: action.payload,
            };
        case TIERS_DISABLE:
            return {
                ...state,
                disabled: true,
            };
        default:
            return state;
    }
};

export const userReducer = (state: ProfileState['userData'], action: ProfileAction) => {
    switch (action.type) {
        case GET_USER_FETCH:
            return {
                ...state,
                isFetching: true,
            };
        case GET_USER_DATA:
            return {
                ...state,
                isFetching: false,
                user: action.payload.user,
            };
        case GET_USER_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case RESET_USER:
            return {
                ...state,
                user: initialStateProfile.userData.user,
            };
        case CHANGE_USER_LEVEL:
            return {
                ...state,
                user: {
                    ...state.user,
                    level: action.payload.level,
                },
            };
        case ENABLE_USER_2FA:
            return {
                ...state,
                user: {
                    ...state.user,
                    otp: true,
                },
            };
        default:
            return state;
    }
};

export const profileReducer = (state = initialStateProfile, action: ProfileAction) => {
    switch (action.type) {
        case CHANGE_PASSWORD_FETCH:
        case CHANGE_PASSWORD_DATA:
        case CHANGE_PASSWORD_ERROR:
            const passwordChangeState = { ...state.passwordChange };
            return {
                ...state,
                passwordChange: passwordChangeReducer(passwordChangeState, action),
            };

        case GENERATE_2FA_QRCODE_FETCH:
        case GENERATE_2FA_QRCODE_DATA:
        case GENERATE_2FA_QRCODE_ERROR:
        case TOGGLE_2FA_FETCH:
        case TOGGLE_2FA_DATA:
        case TOGGLE_2FA_ERROR:
            const twoFactorAuthState = { ...state.twoFactorAuth };
            return {
                ...state,
                twoFactorAuth: twoAuthReducer(twoFactorAuthState, action),
            };

        case TIERS_FETCH:
        case TIERS_DATA:
        case TIERS_DISABLE:
        case TIERS_ERROR:
            const tiersState = { ...state.tiers };
            return {
                ...state,
                tiers: tiersReducer(tiersState, action),
            };

        case GET_USER_FETCH:
        case GET_USER_DATA:
        case RESET_USER:
        case GET_USER_ERROR:
        case CHANGE_USER_LEVEL:
        case ENABLE_USER_2FA:
            const userState = { ...state.userData };
            return {
                ...state,
                userData: userReducer(userState, action),
            };
        default:
            return state;
    }
};

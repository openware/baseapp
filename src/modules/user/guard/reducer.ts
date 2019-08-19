import { GuardAction } from './actions';
import {
    BUILD_EXPIRE,
    BUILD_TYPE,
    CLOSE_GUARD_MODAL,
    LICENSE_DATA,
    LICENSE_ERROR,
    LICENSE_FETCH,
    OPEN_GUARD_MODAL,
    SET_LICENSE_EXPIRATION,
    TENKO_PUBLIC_KEY,
} from './constants';

export interface GuardState {
    version: string;
    versionModalOpened: boolean;
    buildExpire: string;
    tenkoPublicKey: string;
    token: string;
    tokenFetching: boolean;
    expiresAt: number | null;
}

const existedToken = localStorage.getItem('token');

export const initialGuardState: GuardState = {
    version: BUILD_TYPE,
    versionModalOpened: false,
    buildExpire: BUILD_EXPIRE,
    tenkoPublicKey: TENKO_PUBLIC_KEY,
    token: existedToken || '',
    tokenFetching: !existedToken,
    expiresAt: null,
};

export const guardReducer = (state = initialGuardState, action: GuardAction) => {
    switch (action.type) {
        case OPEN_GUARD_MODAL:
            return { ...state, versionModalOpened: true };
        case CLOSE_GUARD_MODAL:
            return { ...state, versionModalOpened: false };
        case LICENSE_FETCH:
            return { ...state, tokenFetching: true };
        case LICENSE_DATA:
            return { ...state, tokenFetching: false, token: action.payload.token };
        case LICENSE_ERROR:
            return { ...state, tokenFetching: false };
        case SET_LICENSE_EXPIRATION:
            return { ...state, expiresAt: action.payload.expiresAt };
        default:
            return state;
    }
};

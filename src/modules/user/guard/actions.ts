import {
    CLOSE_GUARD_MODAL,
    LICENSE_DATA,
    LICENSE_ERROR,
    LICENSE_FETCH,
    OPEN_GUARD_MODAL,
    SET_LICENSE_EXPIRATION,
} from './constants';

export interface OpenGuardModal {
    type: typeof OPEN_GUARD_MODAL;
}

export interface CloseGuardModal {
    type: typeof CLOSE_GUARD_MODAL;
}

export interface LicenseFetch {
    type: typeof LICENSE_FETCH;
}

export interface LicenseData {
    type: typeof LICENSE_DATA;
    payload: {
        token: string,
    };
}

export interface LicenseError {
    type: typeof LICENSE_ERROR;
}

export interface SetLicenseExpiration {
    type: typeof SET_LICENSE_EXPIRATION;
    payload: {
        expiresAt: number,
    };
}

export type GuardAction =
    OpenGuardModal
    | CloseGuardModal
    | LicenseFetch
    | LicenseData
    | LicenseError
    | SetLicenseExpiration;

export const openGuardModal = (): OpenGuardModal => ({
    type: OPEN_GUARD_MODAL,
});

export const closeGuardModal = (): CloseGuardModal => ({
    type: CLOSE_GUARD_MODAL,
});

export const licenseFetch = (): LicenseFetch => ({
    type: LICENSE_FETCH,
});

export const licenseData = (payload: LicenseData['payload']): LicenseData => ({
    type: LICENSE_DATA,
    payload,
});

export const licenseError = (): LicenseError => ({
    type: LICENSE_ERROR,
});

export const setLicenseExpiration = (payload: SetLicenseExpiration['payload']): SetLicenseExpiration => ({
    type: SET_LICENSE_EXPIRATION,
    payload,
});

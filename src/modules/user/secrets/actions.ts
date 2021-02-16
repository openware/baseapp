import {
    SET_SECRET_SAGA_FETCH,
    SET_SECRET_SAGA_DATA,
    SET_SECRET_SAGA_ERROR,
} from './constants';

export interface SetSecretFetch {
    type: typeof SET_SECRET_SAGA_FETCH;
}

export interface SetSecretData {
    type: typeof SET_SECRET_SAGA_DATA;
}

export interface SetSecretError {
    type: typeof SET_SECRET_SAGA_ERROR;
}

export type SecretActions = SetSecretFetch | SetSecretData | SetSecretError;

export const setSecret = (): SetSecretFetch => ({
    type: SET_SECRET_SAGA_FETCH,
});

export const setSecretData = (): SetSecretData => ({
    type: SET_SECRET_SAGA_DATA,
});

export const setSecretError = (): SetSecretError => ({
    type: SET_SECRET_SAGA_ERROR,
});

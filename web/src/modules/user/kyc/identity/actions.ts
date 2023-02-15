import { CommonError } from '../../../types';
import {
    EDIT_IDENTITY_DATA,
    EDIT_IDENTITY_ERROR,
    EDIT_IDENTITY_FETCH,
    SEND_IDENTITY_DATA,
    SEND_IDENTITY_ERROR,
    SEND_IDENTITY_FETCH,
} from './constants';
import { IdentityData } from './types';

export interface SendIdentityFetch {
    type: typeof SEND_IDENTITY_FETCH;
    payload: IdentityData;
}

export interface SendIdentityData {
    type: typeof SEND_IDENTITY_DATA;
    payload: {
        message: string;
    };
}

export interface SendIdentityError {
    type: typeof SEND_IDENTITY_ERROR;
    error: CommonError;
}

export interface EditIdentityFetch {
    type: typeof EDIT_IDENTITY_FETCH;
    payload: IdentityData;
}

export interface EditIdentityData {
    type: typeof EDIT_IDENTITY_DATA;
    payload: {
        message: string;
    };
}

export interface EditIdentityError {
    type: typeof EDIT_IDENTITY_ERROR;
    error: CommonError;
}

export type IdentityAction =
    | SendIdentityFetch
    | SendIdentityData
    | SendIdentityError
    | EditIdentityFetch
    | EditIdentityData
    | EditIdentityError;

export const sendIdentity = (payload: SendIdentityFetch['payload']): SendIdentityFetch => ({
    type: SEND_IDENTITY_FETCH,
    payload,
});

export const sendIdentityData = (payload: SendIdentityData['payload']): SendIdentityData => ({
    type: SEND_IDENTITY_DATA,
    payload,
});

export const sendIdentityError = (error: CommonError): SendIdentityError => ({
    type: SEND_IDENTITY_ERROR,
    error,
});

export const editIdentity = (payload: EditIdentityFetch['payload']): EditIdentityFetch => ({
    type: EDIT_IDENTITY_FETCH,
    payload,
});

export const editIdentityData = (payload: EditIdentityData['payload']): EditIdentityData => ({
    type: EDIT_IDENTITY_DATA,
    payload,
});

export const editIdentityError = (error: CommonError): EditIdentityError => ({
    type: EDIT_IDENTITY_ERROR,
    error,
});

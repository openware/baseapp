import { CommonError } from '../../../types';
import {
    SEND_IDENTITY_DATA,
    SEND_IDENTITY_ERROR,
    SEND_IDENTITY_FETCH,
} from './constants';

export interface SendIdentityFetch {
    type: typeof SEND_IDENTITY_FETCH;
    payload: {
        first_name: string;
        last_name: string;
        dob: string;
        address: string;
        postcode: string;
        city: string;
        country: string;
        metadata: {
            nationality: string,
        },
    };
}

export interface SendIdentityData {
    type: typeof SEND_IDENTITY_DATA;
    payload: {
        message: string;
    };
}

export interface SendIdentityError {
    type: typeof SEND_IDENTITY_ERROR;
    payload: CommonError;
}

export type IdentityAction = SendIdentityFetch
    | SendIdentityData
    | SendIdentityError;

export const sendIdentity = (payload: SendIdentityFetch['payload']): SendIdentityFetch => ({
    type: SEND_IDENTITY_FETCH,
    payload,
});

export const sendIdentityData = (payload: SendIdentityData['payload']): SendIdentityData => ({
    type: SEND_IDENTITY_DATA,
    payload,
});

export const sendIdentityError = (payload: SendIdentityError['payload']): SendIdentityError => ({
    type: SEND_IDENTITY_ERROR,
    payload,
});

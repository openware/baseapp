import { CommonError } from '../../../types';
import {
    SEND_ADDRESSES_DATA,
    SEND_ADDRESSES_ERROR,
    SEND_ADDRESSES_FETCH,
} from './constants';

export interface SendAddressesFetch {
    type: typeof SEND_ADDRESSES_FETCH;
    payload: FormData;
}

export interface SendAddressesData {
    type: typeof SEND_ADDRESSES_DATA;
    payload: {
        message: string;
    };
}

export interface SendAddressesError {
    type: typeof SEND_ADDRESSES_ERROR;
    payload: CommonError;
}

export type AddressesAction = SendAddressesFetch
    | SendAddressesData
    | SendAddressesError;

export const sendAddresses = (payload: SendAddressesFetch['payload']): SendAddressesFetch => ({
    type: SEND_ADDRESSES_FETCH,
    payload,
});

export const sendAddressesData = (payload: SendAddressesData['payload']): SendAddressesData => ({
    type: SEND_ADDRESSES_DATA,
    payload,
});

export const sendAddressesError = (payload: SendAddressesError['payload']): SendAddressesError => ({
    type: SEND_ADDRESSES_ERROR,
    payload,
});

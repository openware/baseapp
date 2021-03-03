import { CommonError } from '../../../modules/types';
import {
    BENEFICIARIES_ACTIVATE,
    BENEFICIARIES_ACTIVATE_DATA,
    BENEFICIARIES_ACTIVATE_ERROR,
    BENEFICIARIES_CREATE,
    BENEFICIARIES_CREATE_DATA,
    BENEFICIARIES_CREATE_ERROR,
    BENEFICIARIES_DATA,
    BENEFICIARIES_DATA_UPDATE,
    BENEFICIARIES_DELETE,
    BENEFICIARIES_DELETE_DATA,
    BENEFICIARIES_DELETE_ERROR,
    BENEFICIARIES_ERROR,
    BENEFICIARIES_FETCH,
    BENEFICIARIES_RESEND_PIN,
    BENEFICIARIES_RESEND_PIN_DATA,
    BENEFICIARIES_RESEND_PIN_ERROR,
} from './constants';
import { Beneficiary } from './types';

export interface BeneficiariesFetch {
    type: typeof BENEFICIARIES_FETCH;
    payload?: {
        currency_id: string;
    };
}

export interface BeneficiariesData {
    type: typeof BENEFICIARIES_DATA;
    payload: Beneficiary[];
}

export interface BeneficiariesDataUpdate {
    type: typeof BENEFICIARIES_DATA_UPDATE;
    payload: Beneficiary;
}

export interface BeneficiariesError {
    type: typeof BENEFICIARIES_ERROR;
    error: CommonError;
}

export interface BeneficiariesActivate {
    type: typeof BENEFICIARIES_ACTIVATE;
    payload: {
        pin: string;
        id: number;
    };
}

export interface BeneficiariesActivateData {
    type: typeof BENEFICIARIES_ACTIVATE_DATA;
    payload: Beneficiary;
}

export interface BeneficiariesActivateError {
    type: typeof BENEFICIARIES_ACTIVATE_ERROR;
    error: CommonError;
}

export interface BeneficiariesResendPin {
    type: typeof BENEFICIARIES_RESEND_PIN;
    payload: {
        id: number;
    };
}

export interface BeneficiariesResendPinData {
    type: typeof BENEFICIARIES_RESEND_PIN_DATA;
    payload: {
        id: number;
    };
}

export interface BeneficiariesResendPinError {
    type: typeof BENEFICIARIES_RESEND_PIN_ERROR;
    error: CommonError;
}

export interface BeneficiariesCreate {
    type: typeof BENEFICIARIES_CREATE;
    payload: {
        currency: string;
        name: string;
        data: string;
        description?: string;
    };
}

export interface BeneficiariesCreateData {
    type: typeof BENEFICIARIES_CREATE_DATA;
    payload: Beneficiary;
}

export interface BeneficiariesCreateError {
    type: typeof BENEFICIARIES_CREATE_ERROR;
    error: CommonError;
}

export interface BeneficiariesDelete {
    type: typeof BENEFICIARIES_DELETE;
    payload: {
        id: number;
    };
}

export interface BeneficiariesDeleteData {
    type: typeof BENEFICIARIES_DELETE_DATA;
    payload: {
        id: number;
    };
}

export interface BeneficiariesDeleteError {
    type: typeof BENEFICIARIES_DELETE_ERROR;
    error: CommonError;
}

export type BeneficiariesActions =
    BeneficiariesFetch
    | BeneficiariesData
    | BeneficiariesDataUpdate
    | BeneficiariesError
    | BeneficiariesActivate
    | BeneficiariesActivateData
    | BeneficiariesActivateError
    | BeneficiariesCreate
    | BeneficiariesCreateData
    | BeneficiariesCreateError
    | BeneficiariesDelete
    | BeneficiariesDeleteData
    | BeneficiariesDeleteError
    | BeneficiariesResendPin
    | BeneficiariesResendPinData
    | BeneficiariesResendPinError;

export const beneficiariesFetch = (payload?: BeneficiariesFetch['payload']): BeneficiariesFetch => ({
    type: BENEFICIARIES_FETCH,
    payload,
});

export const beneficiariesData = (payload: BeneficiariesData['payload']): BeneficiariesData => ({
    type: BENEFICIARIES_DATA,
    payload,
});

export const beneficiariesDataUpdate = (payload: BeneficiariesDataUpdate['payload']): BeneficiariesDataUpdate => ({
    type: BENEFICIARIES_DATA_UPDATE,
    payload,
});

export const beneficiariesError = (error: CommonError): BeneficiariesError => ({
    type: BENEFICIARIES_ERROR,
    error,
});

export const beneficiariesActivate = (payload: BeneficiariesActivate['payload']): BeneficiariesActivate => ({
    type: BENEFICIARIES_ACTIVATE,
    payload,
});

export const beneficiariesActivateData = (payload: BeneficiariesActivateData['payload']): BeneficiariesActivateData => ({
    type: BENEFICIARIES_ACTIVATE_DATA,
    payload,
});

export const beneficiariesActivateError = (error: CommonError): BeneficiariesActivateError => ({
    type: BENEFICIARIES_ACTIVATE_ERROR,
    error,
});

export const beneficiariesCreate = (payload: BeneficiariesCreate['payload']): BeneficiariesCreate => ({
    type: BENEFICIARIES_CREATE,
    payload,
});

export const beneficiariesCreateData = (payload: BeneficiariesCreateData['payload']): BeneficiariesCreateData => ({
    type: BENEFICIARIES_CREATE_DATA,
    payload,
});

export const beneficiariesCreateError = (error: CommonError): BeneficiariesCreateError => ({
    type: BENEFICIARIES_CREATE_ERROR,
    error,
});

export const beneficiariesDelete = (payload: BeneficiariesDelete['payload']): BeneficiariesDelete => ({
    type: BENEFICIARIES_DELETE,
    payload,
});

export const beneficiariesDeleteData = (payload: BeneficiariesDeleteData['payload']): BeneficiariesDeleteData => ({
    type: BENEFICIARIES_DELETE_DATA,
    payload,
});

export const beneficiariesDeleteError = (error: CommonError): BeneficiariesDeleteError => ({
    type: BENEFICIARIES_DELETE_ERROR,
    error,
});

export const beneficiariesResendPin = (payload: BeneficiariesResendPin['payload']): BeneficiariesResendPin => ({
    type: BENEFICIARIES_RESEND_PIN,
    payload,
});

export const beneficiariesResendPinData = (payload: BeneficiariesResendPinData['payload']): BeneficiariesResendPinData => ({
    type: BENEFICIARIES_RESEND_PIN_DATA,
    payload,
});

export const beneficiariesResendPinError = (error: CommonError): BeneficiariesResendPinError => ({
    type: BENEFICIARIES_RESEND_PIN_ERROR,
    error,
});

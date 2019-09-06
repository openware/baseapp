import { CommonError } from '../../../modules/types';
import {
    BENEFICIARIES_ACTIVATE,
    BENEFICIARIES_ACTIVATE_DATA,
    BENEFICIARIES_ACTIVATE_ERROR,
    BENEFICIARIES_CREATE,
    BENEFICIARIES_CREATE_DATA,
    BENEFICIARIES_CREATE_ERROR,
    BENEFICIARIES_DATA,
    BENEFICIARIES_DELETE,
    BENEFICIARIES_DELETE_DATA,
    BENEFICIARIES_DELETE_ERROR,
    BENEFICIARIES_ERROR,
    BENEFICIARIES_FETCH,
} from './constants';
import { Beneficiary } from './types';

export interface BeneficiariesFetch {
    type: typeof BENEFICIARIES_FETCH;
}

export interface BeneficiariesData {
    type: typeof BENEFICIARIES_DATA;
    payload: Beneficiary[];
}

export interface BeneficiariesError {
    type: typeof BENEFICIARIES_ERROR;
    payload: CommonError;
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
    payload: CommonError;
}

export interface BeneficiariesCreate {
    type: typeof BENEFICIARIES_CREATE;
    payload: {
        currency: string;
        name: string;
        description?: string;
        data: string;
    };
}

export interface BeneficiariesCreateData {
    type: typeof BENEFICIARIES_CREATE_DATA;
    payload: Beneficiary;
}

export interface BeneficiariesCreateError {
    type: typeof BENEFICIARIES_CREATE_ERROR;
    payload: CommonError;
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
    payload: CommonError;
}

export type BeneficiariesActions =
    BeneficiariesFetch
    | BeneficiariesData
    | BeneficiariesError
    | BeneficiariesActivate
    | BeneficiariesActivateData
    | BeneficiariesActivateError
    | BeneficiariesCreate
    | BeneficiariesCreateData
    | BeneficiariesCreateError
    | BeneficiariesDelete
    | BeneficiariesDeleteData
    | BeneficiariesDeleteError;

export const beneficiariesFetch = (): BeneficiariesFetch => ({
    type: BENEFICIARIES_FETCH,
});

export const beneficiariesData = (payload: BeneficiariesData['payload']): BeneficiariesData => ({
    type: BENEFICIARIES_DATA,
    payload,
});

export const beneficiariesError = (payload: BeneficiariesError['payload']): BeneficiariesError => ({
    type: BENEFICIARIES_ERROR,
    payload,
});

export const beneficiariesActivate = (payload: BeneficiariesActivate['payload']): BeneficiariesActivate => ({
    type: BENEFICIARIES_ACTIVATE,
    payload,
});

export const beneficiariesActivateData = (payload: BeneficiariesActivateData['payload']): BeneficiariesActivateData => ({
    type: BENEFICIARIES_ACTIVATE_DATA,
    payload,
});

export const beneficiariesActivateError = (payload: BeneficiariesActivateError['payload']): BeneficiariesActivateError => ({
    type: BENEFICIARIES_ACTIVATE_ERROR,
    payload,
});

export const beneficiariesCreate = (payload: BeneficiariesCreate['payload']): BeneficiariesCreate => ({
    type: BENEFICIARIES_CREATE,
    payload,
});

export const beneficiariesCreateData = (payload: BeneficiariesCreateData['payload']): BeneficiariesCreateData => ({
    type: BENEFICIARIES_CREATE_DATA,
    payload,
});

export const beneficiariesCreateError = (payload: BeneficiariesCreateError['payload']): BeneficiariesCreateError => ({
    type: BENEFICIARIES_CREATE_ERROR,
    payload,
});

export const beneficiariesDelete = (payload: BeneficiariesDelete['payload']): BeneficiariesDelete => ({
    type: BENEFICIARIES_DELETE,
    payload,
});

export const beneficiariesDeleteData = (payload: BeneficiariesDeleteData['payload']): BeneficiariesDeleteData => ({
    type: BENEFICIARIES_DELETE_DATA,
    payload,
});

export const beneficiariesDeleteError = (payload: BeneficiariesDeleteError['payload']): BeneficiariesDeleteError => ({
    type: BENEFICIARIES_DELETE_ERROR,
    payload,
});

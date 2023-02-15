import { CommonError } from '../../types';
import { CONFIG_UPDATE, CONFIG_UPDATE_DATA, CONFIG_UPDATE_ERROR } from './constants';
import { ConfigUpdateDataInterface } from './types';

export interface ConfigUpdate {
    type: typeof CONFIG_UPDATE;
    payload: ConfigUpdateDataInterface;
}

export interface ConfigUpdateData {
    type: typeof CONFIG_UPDATE_DATA;
    payload: ConfigUpdateDataInterface;
}

export interface ConfigUpdateError {
    type: typeof CONFIG_UPDATE_ERROR;
    error: CommonError;
}

export type ConfigUpdateAction = ConfigUpdate | ConfigUpdateData | ConfigUpdateError;

export const configUpdate = (payload: ConfigUpdate['payload']): ConfigUpdate => ({
    type: CONFIG_UPDATE,
    payload,
});

export const configUpdateData = (payload: ConfigUpdateData['payload']): ConfigUpdateData => ({
    type: CONFIG_UPDATE_DATA,
    payload,
});

export const configUpdateError = (error: CommonError): ConfigUpdateError => ({
    type: CONFIG_UPDATE_ERROR,
    error,
});

import { CommonError } from '../../types';
import {
    CONFIGS_DATA,
    CONFIGS_ERROR,
    CONFIGS_FETCH,
} from './constants';
import { Configs } from './types';

export interface ConfigsFetch {
    type: typeof CONFIGS_FETCH;
}

export interface ConfigsData {
    type: typeof CONFIGS_DATA;
    payload: Configs;
}

export interface ConfigsError {
    type: typeof CONFIGS_ERROR;
    error: CommonError;
}

export type ConfigsAction =
    ConfigsFetch
    | ConfigsData
    | ConfigsError;

export const configsFetch = (): ConfigsFetch => ({
    type: CONFIGS_FETCH,
});

export const configsData = (payload: ConfigsData['payload']): ConfigsData => ({
    type: CONFIGS_DATA,
    payload,
});

export const configsError = (error: CommonError): ConfigsError => ({
    type: CONFIGS_ERROR,
    error,
});

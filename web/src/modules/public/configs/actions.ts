import {
    CONFIGS_FETCH,
    CONFIGS_ERROR,
    CONFIGS_DATA,
} from './constants';

export interface ConfigsFetch {
    type: typeof CONFIGS_FETCH;
}

export interface ConfigsData {
    type: typeof CONFIGS_DATA;
}

export interface ConfigsError {
    type: typeof CONFIGS_ERROR;
}

export type ConfigsAction = ConfigsFetch | ConfigsData | ConfigsError;

export const configsFetch = (): ConfigsFetch => ({
    type: CONFIGS_FETCH,
});

export const configsData = (): ConfigsData => ({
    type: CONFIGS_DATA,
});

export const configsError = (): ConfigsError => ({
    type: CONFIGS_ERROR,
});

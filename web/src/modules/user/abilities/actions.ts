import {
    ABILITIES_DATA,
    ABILITIES_ERROR,
    ABILITIES_FETCH,
} from './constants';

export interface AbilitiesInterface {
    read?: string[];
    write?: string[];
    create?: string[];
    delete?: string[];
    manage?: string[];
    update?: string[];
    consume?: string[];
    provide?: string[];
}

export interface AbilitiesFetch {
    type: typeof ABILITIES_FETCH;
}

export interface AbilitiesError {
    type: typeof ABILITIES_ERROR;
}

export interface AbilitiesData {
    type: typeof ABILITIES_DATA;
    payload: AbilitiesInterface[];
}

export type AbilitiesAction =
    | AbilitiesFetch
    | AbilitiesData
    | AbilitiesError;

export const abilitiesFetch = (): AbilitiesFetch => ({
    type: ABILITIES_FETCH,
});

export const abilitiesError = (): AbilitiesError => ({
    type: ABILITIES_ERROR,
});

export const abilitiesData = (payload: AbilitiesData['payload']): AbilitiesData => ({
    type: ABILITIES_DATA,
    payload,
});

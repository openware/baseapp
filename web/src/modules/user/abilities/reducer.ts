import { mergeObjects } from '../../../helpers/mergeObjects';
import { AbilitiesAction, AbilitiesInterface } from './actions';
import {
    ABILITIES_DATA,
    ABILITIES_ERROR,
    ABILITIES_FETCH,
} from './constants';

export interface AbilitiesState {
    loading: boolean;
    abilities: AbilitiesInterface;
}

export const initialAbilitiesState: AbilitiesState = {
    loading: true,
    abilities: {},
};

export const abilitiesReducer = (state = initialAbilitiesState, action: AbilitiesAction) => {
    switch (action.type) {
        case ABILITIES_FETCH:
            return { ...state, loading: true };
        case ABILITIES_DATA:
            return { ...state, loading: false, abilities: mergeObjects(action.payload) };
        case ABILITIES_ERROR:
            return { ...state, loading: false };
        default:
            return state;
    }
};

import { CommonState, ToastParams } from '../interfaces';
import { CommonActionTypes } from './types';
import { KeyValuePair, KeyBooleanPair } from 'lib/interfaces';
import { reducerWrapper, monoliteUtil } from 'src/redux/utils';

const INITIAL_COMMON_STATE: CommonState = {
    dialog: {},
    loading: {},
    toast: undefined,
    initialized: false,
};

export const commonReducer = reducerWrapper(INITIAL_COMMON_STATE, {
    [CommonActionTypes.DIALOG]: (state, { key, value }: KeyValuePair) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.dialog[key], value);
        });
    },
    [CommonActionTypes.LOADING]: (state, { key, value }: KeyBooleanPair) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.loading[key], value);
        });
    },
    [CommonActionTypes.SHOW_TOAST]: (state, payload: ToastParams) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.toast, payload);
        });
    },
    [CommonActionTypes.SET_INITIALIZED]: (state, payload: boolean) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.initialized, payload);
        });
    },
});

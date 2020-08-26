import { KeepTypes } from './types';
import { KeepState } from '../interfaces';
import { reducerWrapper, monoliteUtil } from 'src/redux/utils';
import { DEFAULT_LANGUAGE_CODE } from 'src/context/constants';

export const INITIAL_KEEP_STATE: KeepState = {
    locale: DEFAULT_LANGUAGE_CODE,
};

export const keepReducer = reducerWrapper(INITIAL_KEEP_STATE, {
    [KeepTypes.SAVE_LOCALE]: (state, payload: string) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.locale, payload);
        });
    },
});

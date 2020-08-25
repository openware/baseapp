import { LocalizationActionTypes } from './types';
import { LocalizationState, LocalizationContainer } from '../interfaces';
import { DEFAULT_LOCALIZATION_TEXT } from '../components/localization-parser/default';
import { monoliteUtil, reducerWrapper } from 'src/redux/utils';

const initialState: LocalizationState = {
    text: DEFAULT_LOCALIZATION_TEXT
};

export const localizationReducer = reducerWrapper(initialState, {
    [LocalizationActionTypes.LOAD_SUCCESS]: (state, payload: LocalizationContainer) => {
        return monoliteUtil(state, (util) => {
            util.set((_) => _.text, payload);
        });
    }
});

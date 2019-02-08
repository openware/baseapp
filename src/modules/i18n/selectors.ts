import { RootState } from '../index';
import { LanguageState } from './reducer';

export const selectCurrentLanguage = (state: RootState): LanguageState['lang'] =>
    state.app.i18n.lang;

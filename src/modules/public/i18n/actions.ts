import { CHANGE_LANGUAGE } from './constants';

export interface ChangeLanguageAction {
    type: string;
    payload: string;
}
export const changeLanguage = (payload: string): ChangeLanguageAction => ({
    type: CHANGE_LANGUAGE,
    payload,
});

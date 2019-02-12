import { languageMap } from '../../translations';
import * as actions from './actions';
import {
    changeLanguageReducer,
    initialChangeLanguageState,
} from './reducer';

describe('ChangeLanguage reducer', () => {
    it('should handle CHANGE_LANGUAGE', () => {
        let expectedState = {
            lang: 'en',
            messages: languageMap.en,
        };
        expect(changeLanguageReducer(initialChangeLanguageState, actions.changeLanguage('en'))).toEqual(expectedState);
        expect(localStorage.getItem('lang_code')).toEqual('en');
        expectedState = {
            lang: 'ru',
            messages: languageMap.ru,
        };
        expect(changeLanguageReducer(initialChangeLanguageState, actions.changeLanguage('ru'))).toEqual(expectedState);
        expect(localStorage.getItem('lang_code')).toEqual('ru');
    });
});

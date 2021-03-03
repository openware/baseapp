import * as actions from './actions';
import { changeLanguageReducer, initialChangeLanguageState } from './reducer';

describe('ChangeLanguage reducer', () => {
    it('should handle CHANGE_LANGUAGE', () => {
        let expectedState = { lang: 'ru' };
        expect(changeLanguageReducer(initialChangeLanguageState, actions.changeLanguage('ru'))).toEqual(expectedState);
        expect(localStorage.getItem('lang_code')).toEqual('ru');
        expectedState = { lang: 'en' };
        expect(changeLanguageReducer(initialChangeLanguageState, actions.changeLanguage('en'))).toEqual(expectedState);
        expect(localStorage.getItem('lang_code')).toEqual('en');
    });
});

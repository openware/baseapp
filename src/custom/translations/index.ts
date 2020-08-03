import { en } from '../../translations/en';
import { ru } from './ru';

// tslint:disable:no-submodule-imports
// import localeRu from 'react-intl/locale-data/ru';
// tslint:enable

// export const customLocaleData = ([...localeRu]);

export type LangType = typeof en;

export const customLanguageMap = {
    ru,
};

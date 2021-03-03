import { customLanguageMap } from '../custom/translations';
import { en as enCustom } from '../custom/translations/en';
import { en } from './en';

export type LangType = typeof en;

export const languageMap = {
    default: en,
    en: { ...en, ...enCustom },
    ...customLanguageMap,
};

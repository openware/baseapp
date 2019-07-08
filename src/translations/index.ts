import { customLanguageMap } from '../custom/translations';
import { en } from './en';

export type LangType = typeof en;

export const languageMap = {
    default: en,
    en,
    ...customLanguageMap,
};

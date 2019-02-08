import { en } from './en';
import { ru } from './ru';

export type LangType = typeof en;

export const languageMap = {
    default: en,
    en,
    ru,
};

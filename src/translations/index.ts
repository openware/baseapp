import { en } from './en';
import { ru } from './ru';
import { zh } from './zh';

export type LangType = typeof en;

export const languageMap = {
    default: en,
    en,
    ru,
    zh,
};

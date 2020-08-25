import flatten, { unflatten } from 'flat';

import { LocalizationContainer } from '../../interfaces';
import { DEFAULT_LOCALIZATION_TEXT } from './default';

export const LocalizationParser = {
    parse: (jsonObject: any): LocalizationContainer => {
        
        const initObj = { ...DEFAULT_LOCALIZATION_TEXT };
        const initLines = flatten<{}, {}>(initObj, {});
        Object.keys(initLines).forEach((key) => {
            initLines[key] = `[${key}]`;
        });

        const localization = unflatten<any, any>({ ...initLines, ...jsonObject });
        return localization;
    },
};

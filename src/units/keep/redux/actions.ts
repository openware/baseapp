import { KeepTypes } from './types';
import { ReduxUtil } from '../../../redux/utils';

export const KeepActions = {
    saveLocale: (locale: string) => ReduxUtil.getAction(KeepTypes.SAVE_LOCALE, locale)
};

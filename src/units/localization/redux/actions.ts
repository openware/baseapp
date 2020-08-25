import { LocalizationActionTypes } from './types';
import { LocalizationContainer } from '../interfaces';
import { ReduxUtil } from '../../../redux/utils';
import { ActionWith } from 'lib/interfaces';

export const LocalizationActions = {
    setLocale: (payload: string) => ReduxUtil.getAction(LocalizationActionTypes.SET_LOCALE, payload),
    loadSuccess: (data: LocalizationContainer): ActionWith<LocalizationContainer> =>
        ReduxUtil.getAction(LocalizationActionTypes.LOAD_SUCCESS, data),
};

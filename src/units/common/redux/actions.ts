import { CommonActionTypes } from './types';
import { ToastParams } from '../interfaces';
import { ReduxUtil } from '../../../redux/utils';
import { KeyValuePair, KeyBooleanPair } from 'lib/interfaces';

export const CommonActions = {
    init: () => ReduxUtil.getAction(CommonActionTypes.INIT),
    dialog: <T = any>(key: string, options?: T) =>
        ReduxUtil.getAction<KeyValuePair>(CommonActionTypes.DIALOG, { key, value: options }),

    loading: (key: string, value: boolean) =>
        ReduxUtil.getAction<KeyBooleanPair>(CommonActionTypes.LOADING, { key: key, value }),

    showToast: (data?: ToastParams) => ReduxUtil.getAction(CommonActionTypes.SHOW_TOAST, data),

    setInitialized: (data: boolean) => ReduxUtil.getAction(CommonActionTypes.SET_INITIALIZED, data),
};

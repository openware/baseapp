import {
    GENERAL_DIALOG,
    GENERAL_LOADING,
} from './constants';
import { ActionWith, KeyValue } from './types';


export const generalShowDialog = (name: string, options?: any): ActionWith<KeyValue> => ({
    type: GENERAL_DIALOG,
    payload: {
        key: name,
        value: options,
    },
});

export const generalShowLoading = (name: string, show: boolean): ActionWith<KeyValue<boolean>> => ({
    type: GENERAL_LOADING,
    payload: {
        key: name,
        value: show,
    },
});
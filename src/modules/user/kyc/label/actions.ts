import { CommonError } from '../../../types';
import {
    GET_LABEL_DATA,
    GET_LABEL_ERROR,
    GET_LABEL_FETCH,
} from './constants';

export interface Label {
    key: string;
    created_at: string;
    scope: string;
    updated_at: string;
    value: string;
}

export interface LabelFetch {
    type: typeof GET_LABEL_FETCH;
}

export interface LabelData {
    type: typeof GET_LABEL_DATA;
    payload: Label[];
}

export interface LabelError {
    type: typeof GET_LABEL_ERROR;
    payload: CommonError;
}

export type LabelAction =
    | LabelFetch
    | LabelData
    | LabelError;

export const labelFetch = (): LabelFetch => ({
    type: GET_LABEL_FETCH,
});

export const labelData = (payload: LabelData['payload']): LabelData => ({
    type: GET_LABEL_DATA,
    payload,
});

export const labelError = (payload: LabelError['payload']): LabelError => ({
    type: GET_LABEL_ERROR,
    payload,
});

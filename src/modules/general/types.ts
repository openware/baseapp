import { AnyAction } from 'redux';

export interface GeneralState {
    dialog: { [key: string]: any };
    loading: { [key: string]: boolean };
}

export interface KeyValue<T = any> {
    key: string;
    value: T;
}

export interface ActionWith<T = any> extends AnyAction {
    payload: T;
}

import { Action } from 'redux';

export interface ActionWith<PayloadType = any> extends Action {
    payload: PayloadType;
}

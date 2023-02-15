import { ALERT_DATA, ALERT_DELETE, ALERT_DELETE_BY_INDEX, ALERT_PUSH } from './constants';

export interface Alert {
    type: string;
    code?: number;
    message: string[];
}

export interface AlertPush {
    type: typeof ALERT_PUSH;
    payload: Alert;
}

export interface AlertData {
    type: typeof ALERT_DATA;
    payload: Alert;
}

export interface AlertDelete {
    type: typeof ALERT_DELETE;
}

export interface AlertDeleteByIndex {
    type: typeof ALERT_DELETE_BY_INDEX;
    index: number;
}

export type AlertAction = AlertPush | AlertData | AlertDelete | AlertDeleteByIndex;

export const alertPush = (payload: AlertPush['payload']): AlertPush => ({
    type: ALERT_PUSH,
    payload,
});

export const alertData = (payload: AlertData['payload']): AlertData => ({
    type: ALERT_DATA,
    payload,
});

export const alertDelete = (): AlertDelete => ({
    type: ALERT_DELETE,
});

export const alertDeleteByIndex = (index: number): AlertDeleteByIndex => ({
    type: ALERT_DELETE_BY_INDEX,
    index,
});

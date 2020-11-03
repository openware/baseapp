import { Alert, AlertAction } from './actions';
import { ALERT_DATA, ALERT_DELETE, ALERT_DELETE_BY_INDEX, ALERT_PUSH } from './constants';

export interface AlertState {
    alerts: Alert[];
}

export const initialAlertState: AlertState = { alerts: [] };

export const alertReducer = (state = initialAlertState, action: AlertAction) => {
    switch (action.type) {
        case ALERT_DATA:
            return {
                alerts: [...state.alerts, action.payload],
            };
        case ALERT_DELETE:
            return {
                alerts: [...state.alerts.slice(1, state.alerts.length)],
            };
        case ALERT_DELETE_BY_INDEX:
            return {
                alerts: [...state.alerts.slice(0, action.index).concat(...state.alerts.slice(action.index + 1))],
            };
        case ALERT_PUSH:
        default:
            return state;
    }
};

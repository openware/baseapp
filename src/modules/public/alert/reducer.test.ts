import * as actions from './actions';
import { alertReducer, AlertState, initialAlertState } from './reducer';

describe('Alerts reducer', () => {
    it('should handle ALERT_DATA', () => {
        const payload = {
            code: 400,
            type: 'error',
            message: ['Error'],
        };
        const expectedState: AlertState = {
            ...initialAlertState,
            alerts: [payload],
        };
        expect(alertReducer(initialAlertState, actions.alertData(payload))).toEqual(expectedState);
    });

    it('should handle ALERT_DELETE', () => {
        const payload = {
            code: 400,
            type: 'error',
            message: ['Error'],
        };

        const payloadToBeDeleted = {
            code: 401,
            type: 'error',
            message: ['Error'],
        };

        const alertState: AlertState = {
            alerts: [payloadToBeDeleted, payload, payload],
        };

        const expectedState: AlertState = {
            alerts: [payload, payload],
        };
        expect(alertReducer(alertState, actions.alertDelete())).toEqual(expectedState);
    });

    it('should handle ALERT_DELETE_BY_INDEX', () => {
        const payload = {
            code: 400,
            type: 'error',
            message: ['Error'],
        };

        const payloadToBeDeleted = {
            code: 401,
            type: 'error',
            message: ['Error'],
        };

        const alertState: AlertState = {
            alerts: [payload, payloadToBeDeleted, payload],
        };

        const expectedState: AlertState = {
            alerts: [payload, payload],
        };
        expect(alertReducer(alertState, actions.alertDeleteByIndex(1))).toEqual(expectedState);
    });
});

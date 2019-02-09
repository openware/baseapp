import * as actions from './actions';
import {  alertReducer, initialAlertState } from './reducer';

describe('Profile reducer', () => {
    const error = {
        code: 401,
        message: 'Invalid Session',
    };

    const success = 'success';

    it('should handle ERROR_DATA', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error, error ],
        };
        expect(alertReducer(initialAlertState, actions.handleError(error))).toEqual(expectedState);
    });

    it('should handle DELETE_ERROR', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error ],
        };
        expect(alertReducer(initialAlertState, actions.deleteError())).toEqual(expectedState);
    });

    it('should handle ERROR_FETCH', () => {
        const expectedState = {
            ...initialAlertState,
        };
        expect(alertReducer(initialAlertState, actions.fetchError(error))).toEqual(expectedState);
    });

    it('should handle DELETE_ERROR_BY_INDEX', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error ],
        };
        expect(alertReducer(initialAlertState, actions.deleteErrorByIndex(1))).toEqual(expectedState);
    });

    it('should handle SUCCESS_DATA', () => {
        const expectedState = {
            ...initialAlertState,
            success: [ ...initialAlertState.success, success ],
        };
        expect(alertReducer(initialAlertState, actions.handleSuccess(success))).toEqual(expectedState);
    });

    it('should handle DELETE_SUCCESS', () => {
        const expectedState = {
            ...initialAlertState,
            success: [ ...initialAlertState.success ],
        };
        expect(alertReducer(initialAlertState, actions.deleteSuccess())).toEqual(expectedState);
    });

    it('should handle SUCCESS_FETCH', () => {
        const expectedState = {
            ...initialAlertState,
        };
        expect(alertReducer(initialAlertState, actions.fetchSuccess(success))).toEqual(expectedState);
    });

    it('should handle DELETE_SUCCESS_BY_INDEX', () => {
        const expectedState = {
            ...initialAlertState,
            success: [ ...initialAlertState.success ],
        };
        expect(alertReducer(initialAlertState, actions.deleteSuccessByIndex(1))).toEqual(expectedState);
    });
});

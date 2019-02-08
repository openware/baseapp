import * as actions from './actions';
import {  errorReducer, initialAlertState } from './reducer';

describe('Profile reducer', () => {
    const error = {
        code: 401,
        message: 'Invalid Session',
    };

    it('should handle ERROR_DATA', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error, error ],
        };
        expect(errorReducer(initialAlertState, actions.handleError(error))).toEqual(expectedState);
    });

    it('should handle DELETE_ERROR', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error ],
        };
        expect(errorReducer(initialAlertState, actions.deleteError())).toEqual(expectedState);
    });

    it('should handle ERROR_FETCH', () => {
        const expectedState = {
            ...initialAlertState,
        };
        expect(errorReducer(initialAlertState, actions.fetchError(error))).toEqual(expectedState);
    });

    it('should handle DELETE_ERROR_BY_INDEX', () => {
        const expectedState = {
            ...initialAlertState,
            error: [ ...initialAlertState.error ],
        };
        expect(errorReducer(initialAlertState, actions.deleteErrorByIndex(1))).toEqual(expectedState);
    });
});

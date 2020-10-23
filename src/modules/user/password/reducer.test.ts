import * as actions from './actions';
import { PASSWORD_TEST_FORGOT_PASSWORD } from './constants';
import { passwordReducer } from './reducer';

describe('Forgot password reducer', () => {
    const request = { email: 'admin@barong.io' };

    const initialState = {
        loading: false,
        forgotPasswordChanged: false,
        forgotPasswordRequested: false,
    };

    const error: CommonError = {
        code: 401,
        message: ['Invalid Session'],
    };

    it('should return initial state', () => {
        expect(passwordReducer(undefined, { type: PASSWORD_TEST_FORGOT_PASSWORD })).toEqual(initialState);
    });

    it('should handle forgot password fetch', () => {
        const expectedState = {
            ...initialState,
            loading: true,
        };
        expect(passwordReducer(initialState, actions.forgotPassword(request))).toEqual(expectedState);
    });

    it('should handle forgot password success', () => {
        const actualState = {
            ...initialState,
            loading: true,
        };
        const expectedState = {
            ...initialState,
            loading: false,
            forgotPasswordRequested: true,
        };
        expect(passwordReducer(actualState, actions.forgotPasswordSuccess())).toEqual(expectedState);
    });

    it('should handle forgot password error', () => {
        const actualState = {
            ...initialState,
            loading: true,
        };
        const expectedState = {
            ...initialState,
            loading: false,
            forgotPasswordError: error,
        };
        expect(passwordReducer(actualState, actions.forgotPasswordError(error))).toEqual(expectedState);
    });
});

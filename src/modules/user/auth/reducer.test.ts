import * as actions from './actions';
import { AUTH_TEST_STATE } from './constants';
import { authReducer, initialStateAuth } from './reducer';

describe('Auth reducer', () => {
    const error: CommonError = {
        code: 401,
        message: ['Invalid Session'],
    };

    it('should return initial state', () => {
        expect(authReducer(undefined, { type: AUTH_TEST_STATE })).toEqual(initialStateAuth);
    });

    it('should handle LOGOUT_FETCH', () => {
        const expectedState = { ...initialStateAuth };
        expect(authReducer(initialStateAuth, actions.logoutFetch())).toEqual(expectedState);
    });

    it('should handle LOGOUT_FAILURE', () => {
        const expectedState = { ...initialStateAuth, logoutError: error };
        expect(authReducer(initialStateAuth, actions.logoutError(error))).toEqual(expectedState);
    });

    it('should handle SIGN_IN_ERROR', () => {
        const payload = {
            code: 500,
            message: ['Server error'],
        };
        const expectedState = { ...initialStateAuth, authError: payload };
        expect(authReducer(initialStateAuth, actions.signInError(payload))).toEqual(expectedState);
    });

    it('should handle SIGN_IN_REQUIRE_2FA', () => {
        const payload = { require2fa: true };
        const expectedState = { ...initialStateAuth, require2FA: payload.require2fa };
        expect(authReducer(initialStateAuth, actions.signInRequire2FA(payload))).toEqual(expectedState);
    });

    it('should handle SIGN_UP_ERROR', () => {
        const payload = {
            code: 500,
            message: ['Server error'],
        };
        const expectedState = { ...initialStateAuth, signUpError: payload };
        expect(authReducer(initialStateAuth, actions.signUpError(payload))).toEqual(expectedState);
    });

    it('should handle SIGN_UP_REQUIRE_VERIFICATION', () => {
        const payload = {
            requireVerification: true,
        };

        const expectedState = {
            ...initialStateAuth,
            requireVerification: true,
        };

        expect(authReducer(initialStateAuth, actions.signUpRequireVerification(payload))).toEqual(expectedState);
    });

    it('should handle VERIFICATION_FETCH', () => {
        const payload = {
            token: 'token',
        };

        const expectedState = {
            ...initialStateAuth,
            emailVerified: false,
        };

        expect(authReducer(initialStateAuth, actions.verificationFetch(payload))).toEqual(expectedState);
    });

    it('should handle VERIFICATION_SUCCESS', () => {
        const expectedState = {
            ...initialStateAuth,
            emailVerified: true,
        };

        expect(authReducer(initialStateAuth, actions.verificationSuccess())).toEqual(expectedState);
    });
});

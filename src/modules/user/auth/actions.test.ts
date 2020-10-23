import { CommonError } from '../../types';
import * as actions from './actions';

describe('Auth actions', () => {
    it('should check logoutFetch action creator', () => {
        const expectedAction = { type: 'auth/LOGOUT_FETCH' };
        expect(actions.logoutFetch()).toEqual(expectedAction);
    });

    it('should check logoutError action creator', () => {
        const error: CommonError = {
            code: 401,
            message: ['Invalid Session'],
        };
        const expectedAction = { type: 'auth/LOGOUT_FAILURE', error };
        expect(actions.logoutError(error)).toEqual(expectedAction);
    });

    it('should check signIn action creator', () => {
        const payload = {
            email: 'john.barong@gmail.com',
            password: '123123',
        };
        const expectedAction = { type: 'auth/SIGN_IN_FETCH', payload };
        expect(actions.signIn(payload)).toEqual(expectedAction);
    });

    it('should check signInError action creator', () => {
        const error: CommonError = {
            code: 500,
            message: ['Server error'],
        };
        const expectedAction = { type: 'auth/SIGN_IN_ERROR', error };
        expect(actions.signInError(error)).toEqual(expectedAction);
    });

    it('should check signUpError action creator', () => {
        const error: CommonError = {
            code: 500,
            message: ['Server error'],
        };
        const expectedAction = { type: 'auth/SIGN_UP_ERROR', error };
        expect(actions.signUpError(error)).toEqual(expectedAction);
    });

    it('should check signInRequire2FA action creator', () => {
        const payload = { require2fa: true };
        const expectedAction = { type: 'auth/SIGN_IN_REQUIRE_2FA', payload };
        expect(actions.signInRequire2FA(payload)).toEqual(expectedAction);
    });
});

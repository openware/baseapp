import { CommonError } from '../../types';
import * as actions from './actions';

describe('Password actions', () => {
    const fakePasswordRequest = {
        email: 'test@test.com',
    };

    const fakeNewPassword = {
        reset_password_token: '12345671234567',
        password: 'password',
        confirm_password: 'password',
    };

    const fakeError: CommonError = {
        code: 422,
        message: ['Unknown email'],
    };

    it('should check forgot password fetch action', () => {
        const expectedAction = {
            type: 'password/FORGOT_PASSWORD_FETCH',
            payload: fakePasswordRequest,
        };
        expect(actions.forgotPassword(fakePasswordRequest)).toEqual(expectedAction);
    });

    it('should check forgot password fetch successed action', () => {
        const expectedAction = {
            type: 'password/FORGOT_PASSWORD_SUCCESS',
        };
        expect(actions.forgotPasswordSuccess()).toEqual(expectedAction);
    });

    it('should check forgot password error action', () => {
        const expectedAction = {
            type: 'password/FORGOT_PASSWORD_ERROR',
            error: fakeError,
        };
        expect(actions.forgotPasswordError(fakeError)).toEqual(expectedAction);
    });

    it('should check change forgot password fetch action', () => {
        const expectedAction = {
            type: 'password/CHANGE_FORGOT_PASSWORD_FETCH',
            payload: fakeNewPassword,
        };
        expect(actions.changeForgotPasswordFetch(fakeNewPassword)).toEqual(expectedAction);
    });

    it('should check change forgot password success action', () => {
        const expectedAction = {
            type: 'password/CHANGE_FORGOT_PASSWORD_SUCCESS',
        };
        expect(actions.changeForgotPasswordSuccess()).toEqual(expectedAction);
    });
});

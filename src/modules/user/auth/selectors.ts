import { RootState } from '../../index';
import { AuthError } from './actions';
import { AuthState } from './reducer';
// import { CommonError } from '../../types';

export const selectSignInRequire2FA = (state: RootState): AuthState['require2FA'] =>
    state.user.auth.require2FA;

export const selectSignUpRequireVerification = (state: RootState): AuthState['requireVerification'] =>
    state.user.auth.requireVerification;

export const selectEmailVerified = (state: RootState): AuthState['emailVerified'] =>
    state.user.auth.emailVerified;

export const selectAuthError = (state: RootState): AuthError | undefined =>
    state.user.auth.authError;

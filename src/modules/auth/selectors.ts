import { RootState } from '../index';
import { AuthError } from './actions';
import { AuthState } from './reducer';
// import { CommonError } from '../types';

export const selectSignInRequire2FA = (state: RootState): AuthState['require2FA'] =>
    state.app.auth.require2FA;

export const selectSignUpRequireVerification = (state: RootState): AuthState['requireVerification'] =>
    state.app.auth.requireVerification;

export const selectEmailVerified = (state: RootState): AuthState['emailVerified'] =>
    state.app.auth.emailVerified;

export const selectAuthError = (state: RootState): AuthError | undefined =>
    state.app.auth.authError;

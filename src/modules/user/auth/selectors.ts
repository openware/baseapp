import { RootState } from '../../index';
import { CommonError } from '../../types';
import { AuthState } from './reducer';

export const selectSignInRequire2FA = (state: RootState): AuthState['require2FA'] =>
    state.user.auth.require2FA;

export const selectSignUpRequireVerification = (state: RootState): AuthState['requireVerification'] =>
    state.user.auth.requireVerification;

export const selectSignUpError = (state: RootState): CommonError | undefined =>
    state.user.auth.signUpError;

export const selectEmailVerified = (state: RootState): AuthState['emailVerified'] =>
    state.user.auth.emailVerified;

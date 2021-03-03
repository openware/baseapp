import { RootState } from '../../';
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

export const selectCurrentPasswordEntropy = (state: RootState): AuthState['current_password_entropy'] =>
    state.user.auth.current_password_entropy;

export const selectSignInLoading = (state: RootState): AuthState['signInLoading'] =>
    state.user.auth.signInLoading;

export const selectSignInError = (state: RootState): AuthState['authError'] =>
    state.user.auth.authError;

export const selectSignUpLoading = (state: RootState): AuthState['signUpLoading'] =>
    state.user.auth.signUpLoading;

export const selectSignUpSuccess = (state: RootState): AuthState['signUpSuccess'] =>
    state.user.auth.signUpSuccess;

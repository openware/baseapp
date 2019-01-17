import { RootState } from '../index';
import { PasswordState } from './reducer';

export const selectForgotPasswordRequireVerification = (state: RootState): PasswordState['forgotPasswordRequireVerification'] =>
    state.app.password.forgotPasswordRequireVerification;

export const selectForgotPasswordEmailVerified = (state: RootState): PasswordState['emailPasswordVerified'] =>
    state.app.password.emailPasswordVerified;

export const selectChangeForgottenPassport = (state: RootState): PasswordState['changeForgottenPassword'] =>
    state.app.password.changeForgottenPassword;

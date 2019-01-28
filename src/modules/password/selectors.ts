import { RootState } from '../index';
import { PasswordState } from './reducer';

export const selectForgotPasswordError = (state: RootState): PasswordState['error'] | undefined =>
    state.app.password.forgotPasswordError;

export const selectForgotPasswordSuccess = (state: RootState): PasswordState['forgotPasswordRequested'] =>
    state.app.password.forgotPasswordRequested;

export const selectChangeForgotPasswordSuccess = (state: RootState): PasswordState['forgotPasswordChanged'] =>
    state.app.password.forgotPasswordChanged;

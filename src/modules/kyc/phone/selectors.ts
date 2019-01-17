import { RootState } from '../../index';
import { PhoneState } from './reducer';

export const sendPhoneCode = (state: RootState): PhoneState['codeSend'] =>
    state.app.phone.codeSend;

export const selectVerifyPhoneError = (state: RootState): PhoneState['error'] =>
    state.app.phone.error;

export const selectVerifyPhoneSuccess = (state: RootState): PhoneState['successMessage'] =>
    state.app.phone.successMessage;

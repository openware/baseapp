import { RootState } from '../../../index';
import { PhoneState } from './reducer';

export const sendPhoneCode = (state: RootState): PhoneState['codeSend'] =>
    state.user.phone.codeSend;

export const selectVerifyPhoneError = (state: RootState): PhoneState['error'] =>
    state.user.phone.error;

export const selectVerifyPhoneSuccess = (state: RootState): PhoneState['successMessage'] =>
    state.user.phone.successMessage;

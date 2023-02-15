import { RootState } from '../../../';
import { PhoneState } from './reducer';

export const sendPhoneCode = (state: RootState): PhoneState['codeSend'] => state.user.phone.codeSend;

export const selectVerifyPhoneSuccess = (state: RootState): PhoneState['successMessage'] =>
    state.user.phone.successMessage;

export const selectVerifyPhoneLoading = (state: RootState): PhoneState['loading'] => state.user.phone.loading;

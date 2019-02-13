import { RootState } from '../index';
import { CommonError } from '../types';

export const selectSendEmailVerificationSuccess = (state: RootState): boolean =>
    state.app.sendEmailVerification.success;

export const selectSendEmailVerificationError = (state: RootState): CommonError | undefined =>
    state.app.sendEmailVerification.error;

export const selectSendEmailVerificationLoading = (state: RootState): boolean =>
    state.app.sendEmailVerification.loading;

import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectSendEmailVerificationSuccess = (state: RootState): boolean =>
    state.user.sendEmailVerification.success;

export const selectSendEmailVerificationLoading = (state: RootState): boolean =>
    state.user.sendEmailVerification.loading;

export const selectSendEmailVerificationError = (state: RootState): CommonError | undefined =>
    state.user.sendEmailVerification.error;

import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectSendEmailVerificationSuccess = (state: RootState): boolean =>
    state.user.sendEmailVerification.success;

export const selectSendEmailVerificationError = (state: RootState): CommonError | undefined =>
    state.user.sendEmailVerification.error;

export const selectSendEmailVerificationLoading = (state: RootState): boolean =>
    state.user.sendEmailVerification.loading;

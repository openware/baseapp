import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Beneficiary } from './types';


/* Beneficiaries fetch */
export const selectBeneficiaries = (state: RootState): Beneficiary[] =>
    state.user.beneficiaries.fetch.data;

export const selectBeneficiariesFetchLoading = (state: RootState): boolean =>
    state.user.beneficiaries.fetch.fetching;

export const selectBeneficiariesFetchSuccess = (state: RootState): boolean =>
    state.user.beneficiaries.fetch.success;

export const selectBeneficiariesFetchError = (state: RootState): CommonError | undefined =>
    state.user.beneficiaries.fetch.error;

/* Beneficiaries activate */
export const selectBeneficiariesActivateData = (state: RootState): Beneficiary =>
    state.user.beneficiaries.activate.data;

export const selectBeneficiariesActivateLoading = (state: RootState): boolean =>
    state.user.beneficiaries.activate.fetching;

export const selectBeneficiariesActivateSuccess = (state: RootState): boolean =>
    state.user.beneficiaries.activate.success;

export const selectBeneficiariesActivateError = (state: RootState): CommonError | undefined =>
    state.user.beneficiaries.activate.error;

/* Beneficiaries create */
export const selectBeneficiariesCreate = (state: RootState): Beneficiary =>
    state.user.beneficiaries.create.data;

export const selectBeneficiariesCreateLoading = (state: RootState): boolean =>
    state.user.beneficiaries.create.fetching;

export const selectBeneficiariesCreateSuccess = (state: RootState): boolean =>
    state.user.beneficiaries.create.success;

export const selectBeneficiariesCreateError = (state: RootState): CommonError | undefined =>
    state.user.beneficiaries.create.error;

/* Beneficiaries delete */

export const selectBeneficiariesDeleteLoading = (state: RootState): boolean =>
    state.user.beneficiaries.delete.fetching;

export const selectBeneficiariesDeleteSuccess = (state: RootState): boolean =>
    state.user.beneficiaries.delete.success;

export const selectBeneficiariesDeleteError = (state: RootState): CommonError | undefined =>
    state.user.beneficiaries.delete.error;

/* Beneficiaries resend */
export const selectBeneficiariesResendPinSentAt = (state: RootState): string =>
    state.user.beneficiaries.resend.sent_at;

export const selectBeneficiariesResendPinLoading = (state: RootState): boolean =>
    state.user.beneficiaries.resend.fetching;

export const selectBeneficiariesResendPinSuccess = (state: RootState): boolean =>
    state.user.beneficiaries.resend.success;

export const selectBeneficiariesResendPinError = (state: RootState): CommonError | undefined =>
    state.user.beneficiaries.resend.error;

import { PaymentMethodModal, PaymentMethodState, RootState } from '../../';

export const selectPaymentMethodModal = (state: RootState): PaymentMethodModal['payload'] =>
    state.user.paymentMethod.modal;

export const selectPaymentMethodError = (state: RootState): PaymentMethodState['error'] =>
    state.user.paymentMethod.error;

export const selectPaymentMethodList = (state: RootState): PaymentMethodState['list'] => state.user.paymentMethod.list;

export const selectPaymentMethodSuccess = (state: RootState): PaymentMethodState['success'] =>
    state.user.paymentMethod.success;

export const selectPaymentMethodLoading = (state: RootState): PaymentMethodState['loading'] =>
    state.user.paymentMethod.loading;

export const selectPaymentMethodsLoading = (state: RootState): PaymentMethodState['listLoading'] =>
    state.user.paymentMethod.listLoading;

export const selectPaymentMethodsTimestamp = (state: RootState): number | undefined =>
    state.user.paymentMethod.timestamp;

export const selectShouldFetchPaymentMethods = (state: RootState): boolean =>
    !selectPaymentMethodsTimestamp(state) && !selectPaymentMethodsLoading(state);

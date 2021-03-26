import { PaymentMethodModal, PaymentMethodState, RootState } from '../../';

export const selectPaymentMethodModal = (state: RootState): PaymentMethodModal['payload'] => state.user.paymentMethod.modal;

export const selectPaymentMethodCreating = (state: RootState): PaymentMethodState['creating'] => state.user.paymentMethod.creating;

export const selectPaymentMethodUpdating = (state: RootState): PaymentMethodState['updating'] => state.user.paymentMethod.updating;

export const selectPaymentMethodDeleting = (state: RootState): PaymentMethodState['deleting'] => state.user.paymentMethod.deleting;

export const selectPaymentMethodError = (state: RootState): PaymentMethodState['error'] => state.user.paymentMethod.error;

export const selectPaymentMethodList = (state: RootState): PaymentMethodState['list'] => state.user.paymentMethod.list;

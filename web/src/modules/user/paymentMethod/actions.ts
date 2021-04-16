import {
    PAYMENT_METHOD_LIST,
    PAYMENT_METHOD_LIST_FETCH,
    PAYMENT_METHOD_CREATE,
    PAYMENT_METHOD_CREATE_FETCH,
    PAYMENT_METHOD_DELETE,
    PAYMENT_METHOD_DELETE_FETCH,
    PAYMENT_METHOD_ERROR,
    PAYMENT_METHOD_MODAL,
    PAYMENT_METHOD_UPDATE,
    PAYMENT_METHOD_UPDATE_FETCH,
} from './constants';
import { PaymentMethodState, UserPaymentMethod } from './reducer';

export interface PaymentMethodListFetch {
    type: typeof PAYMENT_METHOD_LIST_FETCH;
}

export interface PaymentMethodListData {
    type: typeof PAYMENT_METHOD_LIST;
    payload: UserPaymentMethod[];
}

export interface PaymentMethodCreateFetch {
    type: typeof PAYMENT_METHOD_CREATE_FETCH;
    payload: {
        payment_method_id: number;
        data?: any;
    };
}

export interface PaymentMethodCreateData {
    type: typeof PAYMENT_METHOD_CREATE;
}

export interface PaymentMethodUpdateFetch {
    type: typeof PAYMENT_METHOD_UPDATE_FETCH;
    payload: {
        payment_method_id: number;
        data?: any;
    };
}

export interface PaymentMethodUpdateData {
    type: typeof PAYMENT_METHOD_UPDATE;
}

export interface PaymentMethodDeleteFetch {
    type: typeof PAYMENT_METHOD_DELETE_FETCH;
    payload: {
        payment_method_id: number;
    };
}

export interface PaymentMethodDelete {
    type: typeof PAYMENT_METHOD_DELETE;
    payload: {
        payment_method_id: number;
    };
}

export interface PaymentMethodError {
    type: typeof PAYMENT_METHOD_ERROR;
}

export interface PaymentMethodModal {
    type: typeof PAYMENT_METHOD_MODAL;
    payload: PaymentMethodState['modal'];
}

export type PaymentMethodAction = PaymentMethodDeleteFetch
    | PaymentMethodDelete
    | PaymentMethodError
    | PaymentMethodModal
    | PaymentMethodCreateFetch
    | PaymentMethodCreateData
    | PaymentMethodUpdateFetch
    | PaymentMethodUpdateData
    | PaymentMethodListFetch
    | PaymentMethodListData;

export const paymentMethodListFetch = (): PaymentMethodListFetch => ({
    type: PAYMENT_METHOD_LIST_FETCH,
});

export const paymentMethodList = (payload: PaymentMethodListData['payload']): PaymentMethodListData => ({
    type: PAYMENT_METHOD_LIST,
    payload,
});

export const paymentMethodCreateFetch = (payload: PaymentMethodCreateFetch['payload']): PaymentMethodCreateFetch => ({
    type: PAYMENT_METHOD_CREATE_FETCH,
    payload,
});

export const paymentMethodCreate = (): PaymentMethodCreateData => ({
    type: PAYMENT_METHOD_CREATE,
});

export const paymentMethodUpdateFetch = (payload: PaymentMethodUpdateFetch['payload']): PaymentMethodUpdateFetch => ({
    type: PAYMENT_METHOD_UPDATE_FETCH,
    payload,
});

export const paymentMethodUpdate = (): PaymentMethodUpdateData => ({
    type: PAYMENT_METHOD_UPDATE,
});

export const paymentMethodDeleteFetch = (payload: PaymentMethodDeleteFetch['payload']): PaymentMethodDeleteFetch => ({
    type: PAYMENT_METHOD_DELETE_FETCH,
    payload,
});

export const paymentMethodDelete = (payload: PaymentMethodDelete['payload']): PaymentMethodDelete => ({
    type: PAYMENT_METHOD_DELETE,
    payload,
});

export const paymentMethodError = (): PaymentMethodError => ({
    type: PAYMENT_METHOD_ERROR,
});

export const paymentMethodModal = (payload: PaymentMethodModal['payload']): PaymentMethodModal => ({
    type: PAYMENT_METHOD_MODAL,
    payload,
});

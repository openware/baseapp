import { PaymentMethodAction } from './actions';
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

export interface PaymentMethodStateModal {
    active: boolean;
    action?: 'createStep1' | 'createStep2' | 'update' | 'delete';
    id?: string;
    name?: string;
    data?: any;
}

export interface UserPaymentMethod {
    id: string;
    type: string;
    name: string;
    logo: string;
    data: any;
}

export interface PaymentMethodState {
    list: UserPaymentMethod[];
    listLoading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: boolean;
    modal: PaymentMethodStateModal;
}

export const initialPaymentMethodState: PaymentMethodState = {
    list: [],
    listLoading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: false,
    modal: {
        active: false,
    },
};

export const paymentMethodReducer = (state = initialPaymentMethodState, action: PaymentMethodAction): PaymentMethodState => {
    switch (action.type) {
        case PAYMENT_METHOD_LIST_FETCH:
            return {
                ...state,
                listLoading: true,
                error: false,
            };
        case PAYMENT_METHOD_LIST:
            return {
                ...state,
                list: action.payload,
                listLoading: false,
                error: false,
            };
        case PAYMENT_METHOD_CREATE_FETCH:
            return {
                ...state,
                creating: true,
                error: false,
            };
        case PAYMENT_METHOD_CREATE:
            return {
                ...state,
                creating: false,
            };
        case PAYMENT_METHOD_UPDATE_FETCH:
            return {
                ...state,
                updating: true,
                error: false,
            };
        case PAYMENT_METHOD_UPDATE:
            return {
                ...state,
                updating: false,
            };
        case PAYMENT_METHOD_DELETE_FETCH:
            return {
                ...state,
                deleting: true,
                error: false,
            };
        case PAYMENT_METHOD_DELETE:
            return {
                ...state,
                deleting: false,
                error: false,
            };
        case PAYMENT_METHOD_ERROR:
            return {
                ...state,
                listLoading: false,
                creating: false,
                deleting: false,
                updating: false,
                error: true,
            };
        case PAYMENT_METHOD_MODAL:
            return {
                ...state,
                modal: action.payload,
            };
        default:
            return state;
    }
};

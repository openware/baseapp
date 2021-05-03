import { PaymentMethod } from 'src/modules/public/p2p';
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
    payment_method_id?: number;
    upm_id?: number;
    name?: string;
    data?: any;
}

export interface UserPaymentMethod {
    id: number;
    payment_method_id: number;
    data: any;
    payment_method: PaymentMethod;
}

export interface PaymentMethodState {
    list: UserPaymentMethod[];
    listLoading: boolean;
    loading: boolean;
    success: boolean;
    error: boolean;
    modal: PaymentMethodStateModal;
    timestamp?: number;
}

export const initialPaymentMethodState: PaymentMethodState = {
    list: [],
    listLoading: false,
    loading: false,
    error: false,
    success: false,
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
                timestamp: Math.floor(Date.now() / 1000),
            };
        case PAYMENT_METHOD_LIST:
            return {
                ...state,
                list: action.payload,
                listLoading: false,
            };
        case PAYMENT_METHOD_CREATE_FETCH:
            return {
                ...state,
                loading: true,
                error: false,
                success: false,
            };
        case PAYMENT_METHOD_CREATE:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case PAYMENT_METHOD_UPDATE_FETCH:
            return {
                ...state,
                loading: true,
                error: false,
                success: false,
            };
        case PAYMENT_METHOD_UPDATE:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case PAYMENT_METHOD_DELETE_FETCH:
            return {
                ...state,
                loading: true,
                error: false,
                success: false,
            };
        case PAYMENT_METHOD_DELETE:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case PAYMENT_METHOD_ERROR:
            return {
                ...state,
                listLoading: false,
                loading: false,
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

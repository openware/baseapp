import { CommonError, CommonState } from '../../types';
import { OrdersAction } from './actions';
import {
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
    SET_CURRENT_PRICE,
} from './constants';


export interface OrdersState extends CommonState {
    executeLoading: boolean;
    executeError?: CommonError;
    currentPrice: string;
}


const initialState: OrdersState = {
    executeLoading: false,
    currentPrice: '',
};


export const ordersReducer = (state = initialState, action: OrdersAction) => {
    switch (action.type) {
        case ORDER_EXECUTE_FETCH:
            return { ...state, executeLoading: true, executeError: undefined };
        case ORDER_EXECUTE_DATA:
            return { ...state, executeLoading: false, executeError: undefined };
        case ORDER_EXECUTE_ERROR:
            return { ...state, executeLoading: false, executeError: action.payload };
        case SET_CURRENT_PRICE:
          return { ...state, currentPrice: action.payload };

        default:
            return state;
    }
};

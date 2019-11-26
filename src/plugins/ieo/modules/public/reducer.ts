import { CommonError } from '../../../../modules/types';
import { IEOAction } from './actions';
import {
    IEO_DATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_ITEM_DATA,
    IEO_ITEM_ERROR,
    IEO_ITEM_FETCH,
    IEO_SET_CURRENT_IEO,
    IEO_UPDATE,
} from './constants';
import { DataIEOInterface } from './types';

export interface PublicIEOState {
    currentIEO?: DataIEOInterface;
    loading: boolean;
    list: DataIEOInterface[];
    success: boolean;
    error?: CommonError;
    ieoDetails?: any; // tslint:disable-line
}

export const initialPublicIEOState: PublicIEOState = {
    list: [],
    success: false,
    loading: false,
};

export const publicIEOReducer = (state = initialPublicIEOState, action: IEOAction) => {
    switch (action.type) {
        case IEO_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case IEO_DATA:
            return {
                ...state,
                list: action.payload,
                loading: false,
                success: true,
            };
        case IEO_ERROR:
            return {
                ...state,
                error: action.payload,
                list: [],
                loading: false,
                success: false,
            };
        case IEO_SET_CURRENT_IEO:
            return {
                ...state,
                currentIEO: action.payload,
            };
        case IEO_ITEM_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case IEO_ITEM_DATA:
            return {
                ...state,
                currentIEO: action.payload.ieo,
                ieoDetails: action.payload.details,
                loading: false,
                success: true,
            };
        case IEO_ITEM_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
                success: false,
            };
        case IEO_UPDATE:
            const index = state.list.findIndex(el => String(el.id) === String(action.payload.id));
            const list = state.list.slice();
            let currentIEO = state.currentIEO;
            if (index !== -1){
                list[index] = action.payload;
            } else {
                list.push(action.payload);
                if (currentIEO && currentIEO.id === action.payload.id) {
                    currentIEO = action.payload;
                }
            }

            return {
                ...state,
                list,
                currentIEO,
            };
        default:
            return state;
    }
};

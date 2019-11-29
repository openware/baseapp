import { CommonError } from '../../../../modules/types';
import { IEOAction } from './actions';
import {
    IEO_DATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_ITEM_DATA,
    IEO_ITEM_ERROR,
    IEO_ITEM_FETCH,
    IEO_RESET_DATA,
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
        case IEO_RESET_DATA:
            return {
                ...state,
                list: [],
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
                currentIEO: action.payload,
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

            // update list
            if (index !== -1){
                const metadata = state.list[index].metadata;
                list[index] = { ...action.payload, metadata };
            } else {
                const metadata = list[index] && list[index].metadata;
                list.push({...action.payload, metadata });
            }

            // update current IEO
            if (currentIEO && currentIEO.id === action.payload.id) {
                const curMetadata = currentIEO.metadata;
                currentIEO = { ...action.payload, metadata: curMetadata };
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

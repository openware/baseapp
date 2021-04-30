import { CommonError } from '../../../../modules/types';
import { IEOAction } from './actions';
import {
    IEO_DATA,
    IEO_DATA_METADATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_FETCH_METADATA,
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
    newIEO?: DataIEOInterface;
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
            let newIEO;

            // update list
            if (index !== -1){
                const metadata = state.list[index].metadata;
                list[index] = metadata ? { ...action.payload, metadata } : { ...action.payload };
            } else {
                list.push(action.payload);
                newIEO = action.payload;
            }

            // update current IEO
            if (currentIEO && currentIEO.id === action.payload.id) {
                const curMetadata = currentIEO.metadata;
                currentIEO = curMetadata ? { ...action.payload, metadata: curMetadata } : { ...action.payload };
            }

            return {
                ...state,
                list,
                currentIEO,
                newIEO,
            };
        case IEO_FETCH_METADATA:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case IEO_DATA_METADATA:
            const ieoIndex = state.list.findIndex(el => String(el.id) === String(action.payload.id));
            const ieoList = state.list.slice();

            if (ieoIndex !== -1) {
                const element = ieoList[ieoIndex];

                if (!element.metadata) {
                    ieoList[ieoIndex] = { ...element, metadata: action.payload.metadata };
                }
            }

            return {
                ...state,
                list: ieoList,
                loading: false,
                success: true,
                newIEO: undefined,
            };
        default:
            return state;
    }
};

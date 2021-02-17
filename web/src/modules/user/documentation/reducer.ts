import { CommonError, CommonState } from '../../../modules/types';
import { DocumentationAction } from './actions';
import {
    DOC_TRADE_USER_API_DATA,
    DOC_TRADE_USER_API_ERROR,
    DOC_TRADE_USER_API_FETCH,
} from './constants';
import { DocTradeUserApiDataInterface } from './types';

export interface DocumentationState extends CommonState {
    data?: DocTradeUserApiDataInterface;
    error?: CommonError;
    loading: boolean;
    success: boolean;
    timestamp?: number;
}

export const initialDocumentationState: DocumentationState = {
    loading: false,
    success: false,
};

export const documentationReducer = (state = initialDocumentationState, action: DocumentationAction) => {
    switch (action.type) {
        case DOC_TRADE_USER_API_FETCH:
            return {
                ...state,
                data: undefined,
                error: undefined,
                loading: true,
                success: false,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case DOC_TRADE_USER_API_DATA:
            return {
                ...state,
                data: action.payload,
                error: undefined,
                loading: false,
                success: true,
            };
        case DOC_TRADE_USER_API_ERROR:
            return {
                ...state,
                data: undefined,
                error: action.payload,
                loading: false,
                success: false,
            };
        default:
            return state;
    }
};

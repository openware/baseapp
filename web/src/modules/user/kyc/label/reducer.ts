import { CommonError } from '../../../types';
import { Label, LabelAction } from './actions';
import {
    GET_LABEL_DATA,
    GET_LABEL_ERROR,
    GET_LABEL_FETCH,
} from './constants';

export interface LabelState {
  data: Label[];
  error?: CommonError;
  isFetching: boolean;
}

export const initialLabelState: LabelState = {
  data: [],
  isFetching: false,
};

export const labelReducer = (state = initialLabelState, action: LabelAction) => {
    switch (action.type) {
        case GET_LABEL_FETCH:
            return {
                ...state,
                isFetching: true,
            };
        case GET_LABEL_DATA:
            return {
                ...state,
                data: action.payload,
                isFetching: false,
            };
        case GET_LABEL_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        default:
            return state;
    }
};

import { CommonError } from '../types';
import { ErrorAction } from './actions';
import {
    DELETE_ERROR,
    DELETE_ERROR_BY_INDEX,
    ERROR_DATA,
    ERROR_FETCH,
} from './constants';

export interface AlertState {
    error: CommonError[];
}

export const initialAlertState: AlertState = { error: [] };

export const errorReducer = (state = initialAlertState, action: ErrorAction) => {
    switch (action.type) {
        case ERROR_DATA:
            return {
                ...state,
                error: [...state.error, action.error],
            };
        case DELETE_ERROR:
            return {
                ...state,
                error: [...state.error.slice(1, state.error.length)],
            };
          case DELETE_ERROR_BY_INDEX:
              return {
                  ...state,
                  error: [...state.error.slice(0, action.index).concat(...state.error.slice(action.index + 1))],
              };
          case ERROR_FETCH:
              return {
                  ...state,
              };
        default:
            return state;
    }
};

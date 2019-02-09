import { CommonError } from '../types';
import { AlertAction } from './actions';
import {
    DELETE_ERROR,
    DELETE_ERROR_BY_INDEX,
    DELETE_SUCCESS,
    DELETE_SUCCESS_BY_INDEX,
    ERROR_DATA, ERROR_FETCH,
    SUCCESS_DATA,
    SUCCESS_FETCH,
} from './constants';

export interface AlertState {
    error: CommonError[];
    success: string[];
}

export const initialAlertState: AlertState = { error: [], success: [] };

export const alertReducer = (state = initialAlertState, action: AlertAction) => {
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
          case SUCCESS_DATA:
              return {
                  ...state,
                  success: [...state.success, action.success],
              };
          case DELETE_SUCCESS:
              return {
                  ...state,
                  success: [...state.success.slice(1, state.success.length)],
              };
          case DELETE_SUCCESS_BY_INDEX:
              return {
                  ...state,
                  success: [...state.success.slice(0, action.index).concat(...state.success.slice(action.index + 1))],
              };
          case SUCCESS_FETCH:
              return {
                  ...state,
              };
        default:
            return state;
    }
};

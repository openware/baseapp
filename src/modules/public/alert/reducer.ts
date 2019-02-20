import { CommonError } from '../../types';
import { AlertAction } from './actions';
import {
    ALERT_DELETE_ERROR,
    ALERT_DELETE_ERROR_BY_INDEX,
    ALERT_DELETE_SUCCESS,
    ALERT_DELETE_SUCCESS_BY_INDEX,
    ALERT_ERROR_DATA, ALERT_ERROR_PUSH,
    ALERT_SUCCESS_DATA,
    ALERT_SUCCESS_PUSH,
} from './constants';

export interface AlertState {
    error: CommonError[];
    success: string[];
}

export const initialAlertState: AlertState = { error: [], success: [] };

export const alertReducer = (state = initialAlertState, action: AlertAction) => {
    switch (action.type) {
        case ALERT_ERROR_DATA:
            return {
                ...state,
                error: [...state.error, action.error],
            };
        case ALERT_DELETE_ERROR:
            return {
                ...state,
                error: [...state.error.slice(1, state.error.length)],
            };
          case ALERT_DELETE_ERROR_BY_INDEX:
              return {
                  ...state,
                  error: [...state.error.slice(0, action.index).concat(...state.error.slice(action.index + 1))],
              };
          case ALERT_ERROR_PUSH:
              return {
                  ...state,
              };
          case ALERT_SUCCESS_DATA:
              return {
                  ...state,
                  success: [...state.success, action.success],
              };
          case ALERT_DELETE_SUCCESS:
              return {
                  ...state,
                  success: [...state.success.slice(1, state.success.length)],
              };
          case ALERT_DELETE_SUCCESS_BY_INDEX:
              return {
                  ...state,
                  success: [...state.success.slice(0, action.index).concat(...state.success.slice(action.index + 1))],
              };
          case ALERT_SUCCESS_PUSH:
              return {
                  ...state,
              };
        default:
            return state;
    }
};

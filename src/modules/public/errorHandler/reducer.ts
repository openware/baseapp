import { ErrorHandlerAction } from './actions';
import { ERROR_HANDLE_DATA, ERROR_HANDLE_FETCH } from './constants';

export interface ErrorHandlerState {
    processing: boolean;
}

export const initialErrorHandlerState: ErrorHandlerState = {
    processing: false,
};

export const errorHandlerReducer = (state = initialErrorHandlerState, action: ErrorHandlerAction) => {
    switch (action.type) {
        case ERROR_HANDLE_FETCH:
            return {
                processing: true,
            };
        case ERROR_HANDLE_DATA:
            return {
                processing: false,
            };
        default:
            return state;
    }
};

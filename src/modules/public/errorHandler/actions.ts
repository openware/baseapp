import { ERROR_HANDLE_DATA, ERROR_HANDLE_FETCH } from './constants';

export interface ErrorHandlerFetch {
    type: typeof ERROR_HANDLE_FETCH;
    payload: {
        processingType: 'sentry' | 'alert' | 'console';
        error: any;
        extraOptions?: any;
    };
}

interface ErrorHandlerData {
    type: typeof ERROR_HANDLE_DATA;
}

export type ErrorHandlerAction = ErrorHandlerFetch | ErrorHandlerData;

export const sendError = (payload: ErrorHandlerFetch['payload']): ErrorHandlerFetch => ({
    type: ERROR_HANDLE_FETCH,
    payload,
});

export const getErrorData = (): ErrorHandlerData => ({
    type: ERROR_HANDLE_DATA,
});

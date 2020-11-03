import * as Sentry from '@sentry/browser';
import { call, put } from 'redux-saga/effects';

import { alertPush } from '../../alert';
import { ErrorHandlerFetch, getErrorData } from '../actions';
import { getMetaMaskErrorMessage } from '../helpers/getMetaMaskErrorMessage';

export function* handleErrorSaga(action: ErrorHandlerFetch) {
    const { processingType, extraOptions, error } = action.payload;
    const { actionError } = extraOptions;

    if (extraOptions) {
        const { params, type } = extraOptions;

        if (type) {
            switch (type) {
                case 'METAMASK_HANDLE_ERROR':
                    error.message = [getMetaMaskErrorMessage(error)];

                    if (error.message[0] === 'metamask.error.unknown') {
                        yield call(handleConsoleError, error);
                    }

                    break;
                default:
                    window.console.log(`Unexpected action with type: ${type}`);
                    break;
            }
        }

        if (actionError) {
            params ? yield put(actionError(params)) : yield put(actionError(error));
        }
    }

    switch (processingType) {
        case 'sentry':
            yield call(handleSentryError, error);
            break;
        case 'alert':
            yield call(handleAlertError, error);
            break;
        case 'console':
            yield call(handleConsoleError, error);
            break;
        default:
            break;
    }

    yield put(getErrorData());
}

function* handleSentryError(error) {
    for (const item of error.message) {
        yield call(Sentry.captureException, item);
    }
}

function* handleAlertError(error) {
    yield put(
        alertPush({
            message: error.message,
            code: error.code,
            type: 'error',
        })
    );
}

function* handleConsoleError(error) {
    yield call(window.console.error, error.message[0]);
}

import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { createInternalTransfersData, createInternalTransfersError, CreateInternalTransfersFetch } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createInternalTransfersSaga(action: CreateInternalTransfersFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), '/account/internal_transfers', action.payload);
        yield put(createInternalTransfersData());
        yield put(alertPush({ message: ['success.internal.transfer.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: createInternalTransfersError,
                },
            }),
        );
    }
}

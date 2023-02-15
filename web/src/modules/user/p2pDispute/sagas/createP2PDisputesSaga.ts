import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { p2pDisputeData, p2pDisputeError, P2PDisputeFetch } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pDisputeSaga(action: P2PDisputeFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), '/private/order_history', action.payload);
        yield put(p2pDisputeData());
        yield put(alertPush({ message: ['success.p2p.dispute.submit'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pDisputeError,
                },
            }),
        );
    }
}

import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { cancelOfferError, CancelOfferFetch } from '../actions';

const cancelOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* cancelOfferSaga(action: CancelOfferFetch) {
    try {
        const { id } = action.payload;

        yield call(API.post(cancelOptions(getCsrfToken())), `/private/offers/${id}/cancel`, action.payload);

        yield put(alertPush({ message: ['success.offer.cancelling'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: cancelOfferError,
                },
            }),
        );
    }
}

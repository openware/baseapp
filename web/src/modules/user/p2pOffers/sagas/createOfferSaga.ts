import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from 'src/helpers';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { CreateOfferFetch, createOfferData, createOfferError } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* createOfferSaga(action: CreateOfferFetch) {
    try {
        yield call(API.post(executeOptions(getCsrfToken())), '/private/offers', action.payload);

        yield put(createOfferData());
        yield put(alertPush({ message: ['success.offer.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: createOfferError,
            },
        }));
    }
}

import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { sendAddressesData, sendAddressesError, SendAddressesFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendAddressesSaga(action: SendAddressesFetch): SagaIterator {
    try {
        const response = yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/addresses', action.payload);
        const defaultMessage = 'success.addresses.accepted';
        const { message = defaultMessage } = response;
        yield put(sendAddressesData({ message }));
        yield put(alertPush({ message: [defaultMessage], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: sendAddressesError,
                },
            })
        );
    }
}

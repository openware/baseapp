import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { walletsWithdrawCcyData, walletsWithdrawCcyError, WalletsWithdrawCcyFetch } from '../actions';

const walletsWithdrawCcyOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch): SagaIterator {
    try {
        yield call(API.post(walletsWithdrawCcyOptions(getCsrfToken())), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
        yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: walletsWithdrawCcyError,
                },
            })
        );
    }
}

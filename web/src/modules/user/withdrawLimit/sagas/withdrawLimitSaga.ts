import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { withdrawLimitData, withdrawLimitError, WithdrawLimitFetch } from '../actions';

const withdrawOption: RequestOptions = {
    apiVersion: 'applogic',
};

export function* withdrawLimitSaga(action: WithdrawLimitFetch) {
    try {
        const withdrawLimit = yield call(API.get(withdrawOption), '/private/withdraws');
        yield put(withdrawLimitData(withdrawLimit));
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: withdrawLimitError,
            },
        }));
    }
}

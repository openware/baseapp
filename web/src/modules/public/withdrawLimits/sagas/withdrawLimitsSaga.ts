import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { withdrawLimitsData, withdrawLimitsError, WithdrawLimitsFetch } from '../actions';

const withdrawOption: RequestOptions = {
    apiVersion: 'peatio',
};

export function* withdrawLimitsSaga(action: WithdrawLimitsFetch) {
    try {
        const withdrawLimits = yield call(API.get(withdrawOption), '/public/withdraw_limits');
        yield put(withdrawLimitsData(withdrawLimits));
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: withdrawLimitsError,
            },
        }));
    }
}

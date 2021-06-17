import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { userWithdrawalsData, userWithdrawalsError, UserWithdrawalsFetch } from '../actions';

const FeeGroupOption: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsUserWithdrawalsSaga(action: UserWithdrawalsFetch) {
    try {
        const feeGroup = yield call(API.get(FeeGroupOption), 'account/withdraws/sums');
        yield put(userWithdrawalsData(feeGroup));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userWithdrawalsError,
            },
        }));
    }
}

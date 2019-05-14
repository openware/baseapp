// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import {
    withdrawLimitData,
    withdrawLimitError,
    WithdrawLimitFetch,
} from '../actions';

const withdrawOption: RequestOptions = {
    apiVersion: 'applogic',
};

export function* withdrawLimitSaga(action: WithdrawLimitFetch) {
    try {
        const withdrawLimit = yield call(API.get(withdrawOption), '/private/withdraws');
        yield put(withdrawLimitData(withdrawLimit));
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
    } catch (error) {
        yield put(withdrawLimitError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

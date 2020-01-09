// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    walletsWithdrawCcyData,
    walletsWithdrawCcyError,
    WalletsWithdrawCcyFetch,
} from '../actions';

const walletsWithdrawCcyOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.post(walletsWithdrawCcyOptions(currentCsrfToken)), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
    } catch (error) {
        yield put(walletsWithdrawCcyError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

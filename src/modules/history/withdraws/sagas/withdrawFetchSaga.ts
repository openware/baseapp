// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { withdrawsData, withdrawsError, WithdrawsFetch } from '../actions';

export function* withdrawsFetchSaga(action: WithdrawsFetch) {
    try {
        const config: RequestOptions = {
            apiVersion: 'peatio',
        };
        const withdraws = yield call(API.get(config), '/account/withdraws');

        yield put(withdrawsData(withdraws));
    } catch (error) {
        yield put(withdrawsError(error));
        yield put(handleError(error.code));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { WithdrawsFetch } from '../actions';
import { WITHDRAWS_DATA, WITHDRAWS_ERROR } from '../constants';

export function* withdrawsFetchSaga(action: WithdrawsFetch) {
    try {
        const config: RequestOptions = {
            apiVersion: 'peatio',
        };
        const withdraws = yield call(API.get(config), '/account/withdraws');

        yield put({ type: WITHDRAWS_DATA, payload: withdraws });
    } catch (error) {
        yield put({ type: WITHDRAWS_ERROR, payload: error.message });
        yield put(handleError(error.code));
    }
}

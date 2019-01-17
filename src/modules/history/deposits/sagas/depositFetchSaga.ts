// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { DepositsFetch } from '../actions';
import { DEPOSITS_DATA, DEPOSITS_ERROR } from '../constants';

export function* depositFetchSaga(action: DepositsFetch) {
    try {
        const config: RequestOptions = {
            apiVersion: 'peatio',
        };
        const deposits = yield call(API.get(config), '/account/deposits');

        yield put({ type: DEPOSITS_DATA, payload: deposits });
    } catch (error) {
        yield put({ type: DEPOSITS_ERROR, payload: error.message });
        yield put(handleError(error.code));
    }
}

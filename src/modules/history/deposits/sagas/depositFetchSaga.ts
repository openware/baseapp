// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { depositsData, depositsError, DepositsFetch } from '../actions';

export function* depositFetchSaga(action: DepositsFetch) {
    try {
        const config: RequestOptions = {
            apiVersion: 'peatio',
        };
        const deposits = yield call(API.get(config), '/account/deposits');

        yield put(depositsData(deposits));
    } catch (error) {
        yield put(depositsError(error));
        yield put(handleError(error.code));
    }
}

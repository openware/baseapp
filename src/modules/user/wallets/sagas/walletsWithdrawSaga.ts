// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../public/alert';
import {
    walletsWithdrawCcyData,
    walletsWithdrawCcyError,
    WalletsWithdrawCcyFetch,
} from '../actions';

const walletsWithdrawCcyOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
    try {
        yield call(API.post(walletsWithdrawCcyOptions), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
        yield put(fetchSuccess('success.withdraw.actionl'));
    } catch (error) {
        yield put(walletsWithdrawCcyError(error));
        yield put(fetchError(error));
    }
}

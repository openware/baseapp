// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    walletsWithdrawData,
    walletsWithdrawError,
    WalletsWithdrawFetch,
} from '../actions';

const walletsWithdrawOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* walletsWithdrawSaga(action: WalletsWithdrawFetch) {
    try {
        yield call(API.post(walletsWithdrawOptions), '/management/withdraws/new', action.payload);
        yield put(walletsWithdrawData());
    } catch (error) {
        yield put(walletsWithdrawError(error));
        yield put(handleError(error.code));
    }
}

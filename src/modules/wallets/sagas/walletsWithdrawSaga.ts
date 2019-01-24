// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    walletsWithdrawCcyData,
    walletsWithdrawCcyError,
    WalletsWithdrawCcyFetch,
    walletsWithdrawFiatData,
    walletsWithdrawFiatError,
    WalletsWithdrawFiatFetch,
} from '../actions';

const walletsWithdrawFiatOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* walletsWithdrawFiatSaga(action: WalletsWithdrawFiatFetch) {
    try {
        yield call(API.post(walletsWithdrawFiatOptions), '/management/withdraws/new', action.payload);
        yield put(walletsWithdrawFiatData());
    } catch (error) {
        yield put(walletsWithdrawFiatError(error));
        yield put(handleError(error.code));
    }
}

const walletsWithdrawCcyOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
    try {
        yield call(API.post(walletsWithdrawCcyOptions), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
    } catch (error) {
        yield put(walletsWithdrawCcyError(error));
        yield put(handleError(error.code));
    }
}

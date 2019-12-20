// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import { memberLevelsData, memberLevelsError } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* memberLevelsSaga() {
    try {
        const data = yield call(API.get(requestOptions), '/public/member-levels');
        yield put(memberLevelsData(data));
    } catch (error) {
        yield put(memberLevelsError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { feesData, feesError } from '../actions';

const feesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* feesFetchSaga() {
    try {
        const fees = yield call(API.get(feesOptions), '/public/fees/trading');
        yield put(feesData(fees));
    } catch (error) {
        yield put(feesError(error));
    }
}

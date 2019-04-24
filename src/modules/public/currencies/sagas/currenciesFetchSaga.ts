// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    currenciesData,
    currenciesError,
} from '../actions';
import { CURRENCIES_FETCH } from '../constants';

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootCurrenciesSaga() {
    yield takeLatest(CURRENCIES_FETCH, currenciesFetchSaga);
}

export function* currenciesFetchSaga() {
    try {
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');
        yield put(currenciesData(currencies));
    } catch (error) {
        yield put(currenciesError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

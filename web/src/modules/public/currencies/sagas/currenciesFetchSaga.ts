import { call, put, takeLeading } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { currenciesData, currenciesError } from '../actions';
import { CURRENCIES_FETCH } from '../constants';

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootCurrenciesSaga() {
    yield takeLeading(CURRENCIES_FETCH, currenciesFetchSaga);
}

export function* currenciesFetchSaga() {
    try {
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');
        yield put(currenciesData(currencies));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: currenciesError,
            },
        }));
    }
}

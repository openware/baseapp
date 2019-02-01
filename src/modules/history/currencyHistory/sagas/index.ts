// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { HISTORY_FETCH } from '../constants';
import { currencyHistorySaga } from './currencyHistorySaga';

export function* rootCurrencyHistorySaga() {
    yield takeLatest(HISTORY_FETCH, currencyHistorySaga);
}

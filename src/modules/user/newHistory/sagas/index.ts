// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { NEW_HISTORY_FETCH } from '../constants';
import { newHistorySaga } from './historySaga';

export function* rootNewHistorySaga() {
    yield takeLatest(NEW_HISTORY_FETCH, newHistorySaga);
}

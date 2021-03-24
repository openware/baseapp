import { takeLatest } from 'redux-saga/effects';
import { ABILITIES_FETCH } from '../constants';
import { abilitiesSaga } from './abilitiesSaga';

export function* rootAbilitiesSaga() {
    yield takeLatest(ABILITIES_FETCH, abilitiesSaga);
}

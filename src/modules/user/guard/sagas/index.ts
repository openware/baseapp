// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { LICENSE_FETCH } from '../constants';
import { licenseSaga } from './licenseSaga';

export function* rootGuardSaga() {
    yield takeLatest(LICENSE_FETCH, licenseSaga);
}

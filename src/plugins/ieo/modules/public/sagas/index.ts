// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { IEO_FETCH } from '../constants';
import { ieoSaga } from './ieoSaga';

export function* rootPublicIEOSaga() {
    yield takeEvery(IEO_FETCH, ieoSaga);
}

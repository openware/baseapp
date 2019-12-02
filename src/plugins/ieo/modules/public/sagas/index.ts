// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { IEO_FETCH, IEO_FETCH_METADATA, IEO_ITEM_FETCH } from '../constants';
import { ieoItemSaga } from './ieoItemSaga';
import { ieoMetadataSaga } from './ieoMetadataSaga';
import { ieoSaga } from './ieoSaga';

export function* rootPublicIEOSaga() {
    yield takeEvery(IEO_FETCH, ieoSaga);
    yield takeEvery(IEO_ITEM_FETCH, ieoItemSaga);
    yield takeEvery(IEO_FETCH_METADATA, ieoMetadataSaga);
}

import { takeLatest } from 'redux-saga/effects';
import { FEE_GROUP_FETCH } from '../constants';
import { feeGroupSaga } from './feeGroupSaga';

export function* rootFeeGroupSaga() {
    yield takeLatest(FEE_GROUP_FETCH, feeGroupSaga);
}

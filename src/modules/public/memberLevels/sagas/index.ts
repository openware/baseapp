// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { MEMBER_LEVELS_FETCH } from '../constants';
import { memberLevelsSaga } from './memberLevelsSaga';

export function* rootMemberLevelsSaga() {
    yield takeLatest(MEMBER_LEVELS_FETCH, memberLevelsSaga);
}

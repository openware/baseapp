import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { MEMBER_LEVELS_FETCH } from '../constants';
import { memberLevelsSaga } from './memberLevelsSaga';

export function* rootMemberLevelsSaga(): SagaIterator {
    yield takeLatest(MEMBER_LEVELS_FETCH, memberLevelsSaga);
}

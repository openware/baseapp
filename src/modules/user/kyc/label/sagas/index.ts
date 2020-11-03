import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { GET_LABEL_FETCH } from '../constants';
import { labelSaga } from './labelSaga';

export function* rootLabelSaga(): SagaIterator {
    yield takeLatest(GET_LABEL_FETCH, labelSaga);
}

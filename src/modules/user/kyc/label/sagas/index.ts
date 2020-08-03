import { takeLatest } from 'redux-saga/effects';
import {
    GET_LABEL_FETCH,
} from '../constants';
import { labelSaga } from './labelSaga';

export function* rootLabelSaga() {
    yield takeLatest(GET_LABEL_FETCH, labelSaga);
}

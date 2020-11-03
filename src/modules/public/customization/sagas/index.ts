import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { CUSTOMIZATION_FETCH } from '../constants';
import { customizationFetchSaga } from './customizationFetchSaga';

export function* rootCustomizationSaga(): SagaIterator {
    yield takeLatest(CUSTOMIZATION_FETCH, customizationFetchSaga);
}

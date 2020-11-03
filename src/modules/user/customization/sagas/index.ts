import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { CUSTOMIZATION_UPDATE } from '../constants';
import { customizationUpdateSaga } from './customizationUpdateSaga';

export function* rootCustomizationUpdateSaga(): SagaIterator {
    yield takeLatest(CUSTOMIZATION_UPDATE, customizationUpdateSaga);
}

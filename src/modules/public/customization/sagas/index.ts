import { takeLatest } from 'redux-saga/effects';

import { CUSTOMIZATION_FETCH } from '../constants';
import { customizationFetchSaga } from './customizationFetchSaga';

export function* rootCustomizationSaga() {
    yield takeLatest(CUSTOMIZATION_FETCH, customizationFetchSaga);
}

import { takeLatest } from 'redux-saga/effects';
import { CUSTOMIZATION_UPDATE } from '../constants';
import { customizationUpdateSaga } from './customizationUpdateSaga';

export function* rootCustomizationUpdateSaga() {
    yield takeLatest(CUSTOMIZATION_UPDATE, customizationUpdateSaga);
}

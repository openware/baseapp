import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { customizationData } from '../../../public/customization';
import {
    CustomizationUpdate,
    customizationUpdateData,
    customizationUpdateError,
} from '../actions';

const customizationUpdateOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* customizationUpdateSaga(action: CustomizationUpdate) {
    try {
        yield call(API.post(customizationUpdateOptions), '/customization', action.payload);
        yield put(customizationUpdateData(action.payload));
        yield put(customizationData(action.payload));
    } catch (error) {
        yield put(customizationUpdateError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

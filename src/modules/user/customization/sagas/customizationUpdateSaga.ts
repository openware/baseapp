import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { customizationData } from '../../../public/customization';
import { CustomizationUpdate, customizationUpdateData, customizationUpdateError } from '../actions';

const customizationUpdateOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* customizationUpdateSaga(action: CustomizationUpdate) {
    try {
        yield call(API.post(customizationUpdateOptions), '/customization', action.payload);
        yield put(customizationUpdateData(action.payload));
        yield put(customizationData(action.payload));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: customizationUpdateError,
                },
            })
        );
    }
}

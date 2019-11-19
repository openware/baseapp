// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { buildQueryStringArray } from '../../../../../helpers';
import {
    FetchIEO,
    ieoData,
    ieoError,
} from '../actions';

const ieoOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* ieoSaga(action: FetchIEO) {
    try {
        let endPoint = '/public/ieo/sales';

        if (action.payload) {
            endPoint = `${endPoint}?${buildQueryStringArray(action.payload, 'state')}`;
        }

        const payload = yield call(API.get(ieoOptions), endPoint);
        yield put(ieoData(payload));
    } catch (error) {
        yield put(ieoError(error));
    }
}

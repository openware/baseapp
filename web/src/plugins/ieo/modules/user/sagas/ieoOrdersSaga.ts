// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { buildQueryString } from '../../../../../helpers';
import { alertPush } from '../../../../../modules/public/alert';
import {
    ieoOrdersData,
    ieoOrdersError,
    OrdersIEOFetch,
} from '../actions';

const ieoOrdersOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* ieoOrdersSaga(action: OrdersIEOFetch) {
    try {
        let endPoint = '/private/ieo/orders';
        if (action.payload) {
            endPoint = `${endPoint}?${buildQueryString(action.payload)}`;
        }
        const data = yield call(API.get(ieoOrdersOptions), endPoint);
        yield put(ieoOrdersData(data));
    } catch (error) {
        yield put(ieoOrdersError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

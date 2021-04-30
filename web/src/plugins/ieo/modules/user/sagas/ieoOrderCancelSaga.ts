// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import {
    ieoOrderCancelData,
    ieoOrderCancelError,
    OrderIEOCancelFetch,
} from '../actions';


const ieoOrderCancelOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* ieoOrderCancelSaga(action: OrderIEOCancelFetch) {
    try {
        const { id } = action.payload;
        const payload = yield call(API.delete(ieoOrderCancelOptions), `/private/ieo/orders/${id}`);
        yield put(ieoOrderCancelData(payload));
        yield put(alertPush({ message: ['success.order.canceled'], type: 'success'}));
    } catch (error) {
        yield put(ieoOrderCancelError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

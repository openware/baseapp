// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError } from '../../../public/alert';
import {
    userOpenOrdersData,
    userOpenOrdersError,
    UserOpenOrdersFetch,
} from '../actions';


const ordersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* userOpenOrdersFetchSaga(action: UserOpenOrdersFetch) {
    try {
        const { market } = action.payload;
        const list = yield call(API.get(ordersOptions), `/market/orders?market=${market.id}&state=wait`);

        yield put(userOpenOrdersData(list));
    } catch (error) {
        yield put(userOpenOrdersError());
        yield put(pushAlertError(error));
    }
}

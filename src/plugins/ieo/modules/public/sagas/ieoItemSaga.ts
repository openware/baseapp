// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import {
    FetchIEOItem,
    ieoItemData,
    ieoItemError,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* ieoItemSaga(action: FetchIEOItem) {
    try {
        const data = yield call(API.get(requestOptions), `/public/ieo/sales/${action.payload}`);
        yield put(ieoItemData(data));
    } catch (error) {
        yield put(ieoItemError(error));
    }
}

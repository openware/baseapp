// tslint:disable-next-line
import { all, call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import { ordersData, ordersError, OrdersFetch } from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersFetchSaga(action: OrdersFetch) {

    try {
        const { market } = action.payload;
        const createUrl = (state: string) =>
            `/market/orders?market=${market}&state=${state}`;

        const requests = ['wait', 'cancel', 'done'].map(
            state => call(API.get(ordersOptions), createUrl(state)),
        );

        const [ wait, cancel, done ] = yield all(requests);

        yield put(ordersData({
            wait,
            cancel,
            done,
        }));
    } catch (error) {
        yield put(ordersError(error));
        yield put(handleError(error.code));
    }
}

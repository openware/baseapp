// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    walletsAddressData,
    walletsAddressError,
    WalletsAddressFetch,
} from '../actions';

const walletsAddressOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsAddressSaga(action: WalletsAddressFetch) {
    try {
        const url = `/account/deposit_address/${action.payload.currency}`;
        const { address } = yield call(API.get(walletsAddressOptions), url);
        yield put(walletsAddressData({
            address,
            currency: action.payload.currency,
        }));
    } catch (error) {
        yield put(walletsAddressError(error));
        yield put(fetchError(error));
    }
}

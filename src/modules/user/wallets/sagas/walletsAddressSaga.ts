import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { walletsAddressData, walletsAddressError, WalletsAddressFetch } from '../actions';

const walletsAddressOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsAddressSaga(action: WalletsAddressFetch) {
    try {
        const currency = action.payload.currency.toLocaleLowerCase();
        const url = `/account/deposit_address/${currency}`;
        const { address, currencies, state } = yield call(API.get(walletsAddressOptions), url);
        yield put(
            walletsAddressData({
                address,
                currencies,
                currency,
                state,
            })
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: walletsAddressError,
                },
            })
        );
    }
}

// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { walletsData, walletsError } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsSaga() {
    try {
        const accounts = yield call(API.get(walletsOptions), '/account/balances');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const fees = accounts.map(wallet => {
            const currencyInfo = currencies.find(item => item.id === wallet.currency);
            return ({
                ...wallet,
                name: currencyInfo.name,
                explorerTransaction: currencyInfo!.explorer_transaction,
                explorerAddress: currencyInfo!.explorer_address,
                fee: currencyInfo!.withdraw_fee,
                type: currencyInfo!.type,
                fixed: currencyInfo!.precision,
                iconUrl: currencyInfo.icon_url,
            });
        });

        yield put(walletsData(fees));
    } catch (error) {
        yield put(walletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

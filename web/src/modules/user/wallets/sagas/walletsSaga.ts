import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { walletsData, walletsError, WalletsFetch } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsSaga(action: WalletsFetch) {
    try {
        const accounts = yield call(API.get(walletsOptions), '/account/balances');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const accountsByCurrencies = currencies.map(currency => {
            let walletInfo = accounts.filter(wallet => wallet.currency === currency.id);

            if (!walletInfo.length) {
                walletInfo = [{
                    currency: currency.id,
                }];
            }

            return walletInfo.map(acc => ({
                ...acc,
                name: currency?.name,
                explorerTransaction: currency?.explorer_transaction,
                explorerAddress: currency?.explorer_address,
                fee: currency?.withdraw_fee,
                type: currency?.type,
                fixed: currency?.precision,
                iconUrl: currency?.icon_url,
            }));
        });

        yield put(walletsData(accountsByCurrencies.flat()));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: walletsError,
            },
        }));
    }
}

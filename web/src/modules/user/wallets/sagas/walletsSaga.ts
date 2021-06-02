import { call, put } from 'redux-saga/effects';
import { sendError, currenciesData, Currency } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { walletsData, walletsError, WalletsFetch } from '../actions';
import { Wallet } from '../types';

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

        yield put(currenciesData(currencies));

        const accountsByCurrencies = currencies.map((currency: Currency) => {
            let walletInfo = accounts.find((wallet: Wallet) => wallet.currency === currency.id);

            if (!walletInfo) {
                walletInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...walletInfo,
                name: currency?.name,
                blockchain_currencies: currency?.blockchain_currencies?.map(network => {
                    return ({
                        explorerTransaction: network?.explorer_transaction,
                        explorerAddress: network?.explorer_address,
                        fee: network?.withdraw_fee,
                    });
                }),
                type: currency?.type,
                fixed: currency?.precision,
                iconUrl: currency?.icon_url,
            });
        });

        yield put(walletsData(accountsByCurrencies));
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

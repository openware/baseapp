import { call, put, select } from 'redux-saga/effects';
import { sendError, Currency } from '../../../';
import { selectUserIsMember } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { walletsData, walletsError, WalletsFetch } from '../actions';
import { Wallet } from '../types';
import { selectCurrenciesState } from '../../../';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};;


export function* walletsSaga(action: WalletsFetch) {
    try {
        const accounts = yield call(API.get(walletsOptions), '/account/balances');
        const currenciesList =  yield select(selectCurrenciesState);
        const isMember: boolean = yield select(selectUserIsMember);

        const currencies: Currency[] = currenciesList.list;

        const accountsByCurrencies = currencies.map((currency: Currency) => {
            let walletInfo = accounts.find((wallet: Wallet) => wallet.currency === currency.id);

            if (currency.status === 'hidden' && isMember) {
                return null;
            }

            if (!walletInfo) {
                walletInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...walletInfo,
                name: currency?.name,
                networks: currency?.networks?.map(network => ({
                    explorerTransaction: network?.explorer_transaction,
                    explorerAddress: network?.explorer_address,
                    fee: network?.withdraw_fee,
                })),
                type: currency?.type,
                fixed: currency?.precision,
                iconUrl: currency?.icon_url,
            });
        });

        const wallets = accountsByCurrencies.filter(item => item && item.currency);

        yield put(walletsData(wallets));
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

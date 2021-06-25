import { call, put, select } from 'redux-saga/effects';
import { sendError, Currency } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { walletsData, walletsError, WalletsFetch } from '../actions';
import { Wallet } from '../types';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export const getCurrencies = state => state.public.currencies;
export const getUser = state => state.user.profile.userData.user;;

export function* walletsSaga(action: WalletsFetch) {
    try {
        const accounts = yield call(API.get(walletsOptions), '/account/balances');
        const currenciesList =  yield select(getCurrencies);
        const user = yield select(getUser);

        const currencies: Currency[] = currenciesList.list;

        const accountsByCurrencies = currencies.map((currency: Currency) => {
            let walletInfo = accounts.find((wallet: Wallet) => wallet.currency === currency.id);

            if (currency.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
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
                networks: currency?.networks?.map(network => {
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

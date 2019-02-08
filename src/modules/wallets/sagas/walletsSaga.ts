// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import { walletsAddressFetch, walletsData, walletsError } from '../actions';

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
        const withdrawFeesResponse = yield call(API.get(walletsOptions), '/public/fees/withdraw');

        const depositFees = withdrawFeesResponse.reduce((total, fee) => ({
            ...total,
            [fee.currency]: {
                fee: fee.fee,
                type: fee.type,
            },
        }), {});

        const fees = accounts.map(wallet => {
            const currencyInfo = currencies.find(item => item.id === wallet.currency);
            return ({
                ...wallet,
                name: currencyInfo.name,
                explorerTransaction: currencyInfo!.explorer_transaction,
                explorerAddress: currencyInfo!.explorer_address,
                fee: depositFees[wallet.currency]!.fee.value,
                type: depositFees[wallet.currency]!.type,
                fixed: currencyInfo!.precision,
            });
        });

        yield put(walletsData(fees));

        if (accounts.length > 0) {
            const btc = accounts.find(wallet => wallet.currency.toLowerCase() === 'btc');
            if (btc) {
                yield put(walletsAddressFetch({ currency: btc.currency }));
            } else {
                const currency = accounts[0].currency;
                yield put(walletsAddressFetch({ currency }));
            }
        }
    } catch (error) {
        yield put(walletsError(error));
        yield put(fetchError(error));
    }
}

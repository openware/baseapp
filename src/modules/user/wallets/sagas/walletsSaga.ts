// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError } from '../../../public/alert';
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
    } catch (error) {
        yield put(walletsError(error));
        yield put(pushAlertError(error));
    }
}

import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pWalletsData, p2pWalletsError } from '../actions';

const peatioOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const p2pOptions: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pWalletsSaga() {
    try {
        const currencies = yield call(API.get(peatioOptions), '/public/currencies');
        const p2pCurrencies = yield call(API.get(p2pOptions), '/public/currencies');
        const p2pAccounts = yield call(API.get(peatioOptions), '/account/balances?account_type=p2p');

        const p2pAccountByCurrencies = p2pCurrencies.map(p2pCur => {
            const p2pAccount = p2pAccounts.find(acc => acc.currency === p2pCur.id);
            const currency = currencies.find(cur => cur.id === p2pCur.id);

            return ({
                currency: currency?.id,
                account_type: p2pAccount?.account_type,
                balance: p2pAccount?.balance || 0,
                locked: p2pAccount?.locked || 0,
                deposit_address: p2pAccount?.deposit_address || null,
                name: currency?.name,
                explorerTransaction: currency?.explorer_transaction,
                explorerAddress: currency?.explorer_address,
                fee: currency?.withdraw_fee,
                type: currency?.type,
                fixed: currency?.precision,
                iconUrl: currency?.icon_url,
            });
        });

        yield put(p2pWalletsData(p2pAccountByCurrencies));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pWalletsError,
            },
        }));
    }
}

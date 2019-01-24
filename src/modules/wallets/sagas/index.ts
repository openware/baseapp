// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    WALLETS_ADDRESS_FETCH,
    WALLETS_FETCH,
    WALLETS_WITHDRAW_CCY_FETCH,
    WALLETS_WITHDRAW_FIAT_FETCH,
} from '../constants';
import { walletsAddressSaga } from './walletsAddressSaga';
import { walletsSaga } from './walletsSaga';
import { walletsWithdrawCcySaga, walletsWithdrawFiatSaga } from './walletsWithdrawSaga';

export function* rootWalletsSaga() {
    yield takeEvery(WALLETS_FETCH, walletsSaga);
    yield takeEvery(WALLETS_ADDRESS_FETCH, walletsAddressSaga);
    yield takeEvery(WALLETS_WITHDRAW_CCY_FETCH, walletsWithdrawCcySaga);
    yield takeEvery(WALLETS_WITHDRAW_FIAT_FETCH, walletsWithdrawFiatSaga);
}

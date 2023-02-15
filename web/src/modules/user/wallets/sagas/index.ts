import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';
import {
    P2P_WALLETS_FETCH,
    WALLETS_ADDRESS_FETCH,
    WALLETS_FETCH,
    WALLETS_USER_WITHDRAWALS_FETCH,
    WALLETS_WITHDRAW_CCY_FETCH,
} from '../constants';
import { p2pWalletsSaga } from './p2pWalletsSaga';
import { walletsAddressSaga } from './walletsAddressSaga';
import { walletsSaga } from './walletsSaga';
import { walletsUserWithdrawalsSaga } from './walletsUserWithdrawalsSaga';
import { walletsWithdrawCcySaga } from './walletsWithdrawSaga';

export function* rootWalletsSaga() {
    yield takeLeading(WALLETS_FETCH, walletsSaga);
    yield takeLatest(WALLETS_ADDRESS_FETCH, walletsAddressSaga);
    yield takeEvery(WALLETS_WITHDRAW_CCY_FETCH, walletsWithdrawCcySaga);
    yield takeLeading(P2P_WALLETS_FETCH, p2pWalletsSaga);
    yield takeLatest(WALLETS_USER_WITHDRAWALS_FETCH, walletsUserWithdrawalsSaga);
}

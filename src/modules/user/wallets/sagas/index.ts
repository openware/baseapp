import { SagaIterator } from 'redux-saga';
import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { WALLETS_ADDRESS_FETCH, WALLETS_FETCH, WALLETS_WITHDRAW_CCY_FETCH } from '../constants';
import { walletsAddressSaga } from './walletsAddressSaga';
import { walletsSaga } from './walletsSaga';
import { walletsWithdrawCcySaga } from './walletsWithdrawSaga';

export function* rootWalletsSaga(): SagaIterator {
    yield takeLeading(WALLETS_FETCH, walletsSaga);
    yield takeLatest(WALLETS_ADDRESS_FETCH, walletsAddressSaga);
    yield takeEvery(WALLETS_WITHDRAW_CCY_FETCH, walletsWithdrawCcySaga);
}

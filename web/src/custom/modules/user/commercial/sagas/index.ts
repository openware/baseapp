import { takeEvery } from 'redux-saga/effects';
import {
    COMMERCIAL_ACCOUNTS_FETCH,
    COMMERCIAL_ACCOUNT_SWITCH,
} from '../constants';
import { commercialAccountsSaga } from './commercialAccountsSaga';
import { commercialAccountSwitchSaga } from './commercialAccountSwitchSaga';

export function* rootCommercialSaga() {
    yield takeEvery(COMMERCIAL_ACCOUNTS_FETCH, commercialAccountsSaga);
    yield takeEvery(COMMERCIAL_ACCOUNT_SWITCH, commercialAccountSwitchSaga);
}

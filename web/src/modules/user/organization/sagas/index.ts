import { takeEvery } from 'redux-saga/effects';
import {
    ORGANIZATION_ACCOUNTS_FETCH,
    ORGANIZATION_ACCOUNT_SWITCH,
    ORGANIZATION_ABILITIES_FETCH,
} from '../constants';
import { organizationAccountsSaga } from './organizationAccountsSaga';
import { organizationAccountSwitchSaga } from './organizationAccountSwitchSaga';
import { organizationAbilitiesSaga } from './organizationAbilitiesSaga';

export function* rootOrganizationSaga() {
    yield takeEvery(ORGANIZATION_ACCOUNTS_FETCH, organizationAccountsSaga);
    yield takeEvery(ORGANIZATION_ACCOUNT_SWITCH, organizationAccountSwitchSaga);
    yield takeEvery(ORGANIZATION_ABILITIES_FETCH, organizationAbilitiesSaga);
}

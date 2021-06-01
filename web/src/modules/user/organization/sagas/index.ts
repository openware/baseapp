import { takeEvery } from 'redux-saga/effects';
import {
    ORGANIZATION_ACCOUNTS_FETCH,
    ORGANIZATION_ACCOUNT_SWITCH,
} from '../constants';
import { organizationAccountsSaga } from './organizationAccountsSaga';
import { organizationAccountSwitchSaga } from './organizationAccountSwitchSaga';

export function* rootOrganizationSaga() {
    yield takeEvery(ORGANIZATION_ACCOUNTS_FETCH, organizationAccountsSaga);
    yield takeEvery(ORGANIZATION_ACCOUNT_SWITCH, organizationAccountSwitchSaga);
}
